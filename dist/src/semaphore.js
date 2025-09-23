import { queue } from "./queue";
import { assert } from "ts-x";
export class Semaphore {
    constructor(max) {
        this.acquiredSuspend = new queue;
        this.current = 0;
        this.max = max > 1 ? max : 1;
    }
    async Acquire() {
        if (this.current < this.max) {
            this.current += 1;
            return;
        }
        return new Promise((resolve) => {
            this.acquiredSuspend.en(resolve);
        });
    }
    Release() {
        let d = this.acquiredSuspend.de();
        if (d != null) {
            d();
            return;
        }
        // de() == nil
        this.current -= 1;
        assert(this.current >= 0);
    }
    ReleaseAll() {
        for (let d = this.acquiredSuspend.de(); d != null; d = this.acquiredSuspend.de()) {
            d();
        }
        this.current = 0;
    }
}
//# sourceMappingURL=semaphore.js.map