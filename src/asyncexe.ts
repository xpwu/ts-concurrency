
export function asyncExe(exe: ()=>Promise<void>):void {
	exe().then()
}
