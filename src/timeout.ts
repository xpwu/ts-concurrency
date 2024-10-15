import {Duration, Millisecond} from "ts-xutils"

export class Timeout implements Error {
	message: string
	name: string = "Timeout"

	constructor(d: Duration) {
		this.message = `timeout: ${d/Millisecond}ms`
	}
}

export async function withTimeout<R>(d: Duration, exe: ()=>Promise<R>): Promise<R|Timeout> {
	let timer
	let timePro = new Promise<Timeout>((resolve)=>{
		timer = setTimeout(()=>{
			resolve(new Timeout(d))
		}, d/Millisecond)
	})

	let ret = await Promise.race([exe(), timePro])
	clearTimeout(timer)
	return ret
}

