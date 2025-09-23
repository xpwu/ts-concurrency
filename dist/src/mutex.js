import { Semaphore } from "./semaphore";
export class Mutex {
    constructor() {
        this.sem = new Semaphore(1);
    }
    async Lock() {
        await this.sem.Acquire();
    }
    Unlock() {
        this.sem.Release();
    }
    async withLock(exe) {
        await this.Lock();
        try {
            return await exe();
        }
        finally {
            this.Unlock();
        }
    }
}
//# sourceMappingURL=mutex.js.map