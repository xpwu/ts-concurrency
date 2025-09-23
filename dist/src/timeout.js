import { Millisecond } from "ts-x";
export class Timeout {
    constructor(d) {
        this.name = "Timeout";
        this.message = `timeout: ${d / Millisecond}ms`;
    }
}
export async function withTimeout(d, exe) {
    let timer;
    let canceled = false;
    let timePro = new Promise((resolve) => {
        timer = setTimeout(() => {
            canceled = true;
            resolve(new Timeout(d));
        }, d / Millisecond);
    });
    let ret = await Promise.race([exe(() => canceled), timePro]);
    clearTimeout(timer);
    return ret;
}
//# sourceMappingURL=timeout.js.map