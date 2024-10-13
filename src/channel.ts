
export class ChannelClosed implements Error {
	message: string
	name: string = "ChannelClosed"

	constructor(m: string) {
		this.message = m
	}
}

import {queue} from "./queue"

export interface SendChannel<E> {
	Send(e: E): Promise<ChannelClosed|null>
	Close(reason: string):void
	Close():void
}

export interface ReceiveChannel<E> {
	ReceiveOrFailed(): Promise<E|ChannelClosed>
	Receive(): Promise<E|null>
}

export class Channel<E> implements SendChannel<E>, ReceiveChannel<E> {
	data: queue<E> = new queue
	sendSuspend: queue<[E, (ret: ChannelClosed|null)=>void]> = new queue()
	receiveSuspend: queue<(value: E|ChannelClosed)=>void> = new queue()
	max: number
	closed: ChannelClosed|null = null

	constructor(max: number = 0) {
		this.max = max
	}

	Close(reason: string): void
	Close(): void
	Close(reason?: string): void {
		this.closed = new ChannelClosed(reason ? reason : "")
		for (let s = this.sendSuspend.de(); s != null; s = this.sendSuspend.de()) {
			s[1](this.closed)
		}
		for (let r = this.receiveSuspend.de(); r != null; r = this.receiveSuspend.de()) {
			r(this.closed)
		}
	}

	async Send(e: E): Promise<ChannelClosed|null> {
		if (this.closed != null) {
			return this.closed
		}

		let rfun = this.receiveSuspend.de()

		if (this.data.count >= this.max && rfun == null) {
			return new Promise<ChannelClosed|null>((resolve) => {
				this.sendSuspend.en([e, resolve])
			})
		}

		// rfun != nil: data is empty
		if (rfun != null) {
			rfun(e)
			return null
		}

		// rfun == nil && data.count < max: max != 0
		this.data.en(e)
		return null
	}

	async ReceiveOrFailed(): Promise<E|ChannelClosed> {
		if (this.closed != null) {
			return this.closed
		}

		let value = this.data.de()
		let suspend = this.sendSuspend.de()

		if (value == null && suspend == null) {
			return new Promise<E|ChannelClosed>((resolve)=>{
				this.receiveSuspend.en(resolve)
			})
		}

		// value != nil: max != 0
		if (value != null) {
			if (suspend != null) {
				let [v, sfun] = suspend
				this.data.en(v)
				sfun(null)
			}
			return value
		}

		// value == nil && suspend != nil: max == 0
		let [v, sfun] = suspend!
		sfun(null)
		return v
	}

	async Receive(): Promise<E|null> {
		let r = await this.ReceiveOrFailed()
		if (r instanceof ChannelClosed) {
			return null
		}
		return r
	}
}
