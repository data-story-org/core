import { spawn } from 'child_process';

/** SPAWN A CHILD PROCESS AND CAPTURE STDOUT AND STDERR */
async function spawnChild(command, arguments_, options) {
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
	});

	if( exitCode) {
			throw new Error( `subprocess error exit ${exitCode}, ${error}`);
	}
	return data;
}

async function cli($command, ...$args) {
	return spawnChild(
		'node',
		[
			__dirname + '/../../../lib/src/cli/cli.js',
			$command,
			...$args],
		{ 
			shell: true, 
			cwd: __dirname
		}
	)
}

it('can boot via cli', async () => {
	const success = (data) => {
		const diagram = JSON.parse(data)

		expect(diagram.stories).toBeDefined()
		expect(diagram.availableNodes).toBeDefined()
	}

	const fail = (err) => console.error("async error:\n" + err)

  await cli('boot').then(success, fail)
});