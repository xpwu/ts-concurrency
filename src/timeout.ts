import {Duration, Millisecond} from "ts-x"

export class Timeout implements Error {
	message: string
	name: string = "Timeout"

	constructor(d: Duration) {
		this.message = `timeout: ${d/Millisecond}ms`
	}
}

export async function withTimeout<R>(d: Duration, exe: (canceled: ()=>boolean)=>Promise<R>): Promise<R|Timeout> {
	let timer
	let canceled = false
	let timePro = new Promise<Timeout>((resolve)=>{
		timer = setTimeout(()=>{
			canceled = true
			resolve(new Timeout(d))
		}, d/Millisecond)
	})

	let ret = await Promise.race([exe(()=>canceled), timePro])
	clearTimeout(timer)
	return ret
}

