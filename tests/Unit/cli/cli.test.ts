import { spawn } from 'child_process';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import CreateJSON from '../../../src/server/nodes/CreateJSON'
import Inspect from '../../../src/server/nodes/Inspect'
import { nonCircularJsonStringify } from '../../../src/utils/nonCircularJsonStringify';

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
	return await spawnChild(
		'node',
		[
			__dirname + '/../../../cli/cli.js',
			$command,
			...$args],
		{ 
			shell: true, 
			cwd: __dirname
		}
	)
}

function addslashes(string) {
	return string.replace(/\\/g, '\\\\').
			replace(/\u0008/g, '\\b').
			replace(/\t/g, '\\t').
			replace(/\n/g, '\\n').
			replace(/\f/g, '\\f').
			replace(/\r/g, '\\r').
			replace(/'/g, '\\\'').
			replace(/"/g, '\\"');
}

it('can boot via cli', async () => {
	const success = (data) => {
		const diagram = JSON.parse(data)

		expect(diagram.stories).toBeDefined()
		expect(diagram.availableNodes).toBeDefined()
	}

	const fail = (err) => {
		console.error("async error:\n" + err)
		throw 'Failed to run the CLI'
	}

  await cli('boot').then(success, fail)
});

it.skip('can run via cli', async () => {
	let diagram = DiagramBuilder.begin()
		.add(CreateJSON)
		.add(Inspect)
		.finish()

	const success = (data) => {
		// const diagram: any = JSON.parse(data)
		// expect(diagram.nodes[1].features .......).toBe(true)
	}

	const fail = (err) => {
		console.error("async error:\n" + err)
		throw 'Failed to run the CLI'
	}

	let json = nonCircularJsonStringify(diagram)
	json = addslashes(json)

  await cli('run "' + json + '"').then(success, fail)
});