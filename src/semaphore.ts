import {queue} from "./queue"
import {assert} from "ts-xutils"


export class Semaphore {
	acquiredSuspend: queue<() => void> = new queue
	public max: number
	public current: number = 0

	constructor(max: number) {
		this.max = max > 1? max : 1
	}

	async Acquire(): Promise<void> {
		if (this.current < this.max) {
			this.current += 1
			return
		}

		return new Promise((resolve)=>{
			this.acquiredSuspend.en(resolve)
		})
	}

	Release(): void {
		let d = this.acquiredSuspend.de()
		if (d != null) {
			d()
			return
		}

		// de() == nil
		this.current -= 1
		assert(this.current >= 0)
	}

	ReleaseAll(): void {
		for (let d = this.acquiredSuspend.de(); d != null; d = this.acquiredSuspend.de()) {
			d()
		}
		this.current = 0
	}
}

