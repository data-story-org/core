import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import CreateJSON from '../../../src/server/nodes/CreateJSON'
import Inspect from '../../../src/server/nodes/Inspect'
import { nonCircularJsonStringify } from '../../../src/utils/nonCircularJsonStringify';
import { addSlashes } from '../../../src/utils/Str'
import { spawnChild } from '../../../src/utils/process_'

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
	json = addSlashes(json)

  await cli('run "' + json + '"').then(success, fail)
});