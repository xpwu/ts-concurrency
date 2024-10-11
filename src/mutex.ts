import {Semaphore} from "./semaphore"


export class Mutex {
	sem = new Semaphore(1)

	async Lock(): Promise<void> {
		await this.sem.Acquire()
	}

	Unlock(): void {
		this.sem.Release()
	}

	async withLock<R>(exe: ()=>Promise<R>): Promise<R> {
		await this.Lock()
		try {
			return await exe()
		}finally {
			this.Unlock()
		}
	}
}

