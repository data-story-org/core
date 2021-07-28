import { spawn, SpawnOptions } from 'child_process';

/** SPAWN A CHILD PROCESS AND CAPTURE STDOUT AND STDERR */
export const spawnChild = async (command: string, arguments_: string[], options: SpawnOptions): Promise<string> => {
	const child = spawn(command, arguments_, options);

	let data = "";
	for await (const chunk of child.stdout) {
			console.log('stdout chunk: '+chunk);
			data += chunk;
	}
	let error = "";
	for await (const chunk of child.stderr) {
			console.error('stderr chunk: '+chunk);
			error += chunk;
	}
	const exitCode = await new Promise( (resolve, reject) => {
		child.on('close', resolve);
		// child.on('error', reject);
	});

	if(exitCode) {
		throw 'throwing from process_ ' + exitCode + ' ' + error
	}


	return data;
}