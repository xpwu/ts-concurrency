
export function asyncExe(exe: ()=>Promise<void>):void {
	// ignore return
	new Promise<void>(async (resolve) => {
		await exe()
		resolve()
	})
}
