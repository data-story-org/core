import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import Diagram from '../../../src/server/Diagram';
import CreateJSON from '../../../src/server/nodes/CreateJSON'
import Inspect from '../../../src/server/nodes/Inspect'
import { nonCircularJsonStringify } from '../../../src/utils/nonCircularJsonStringify';
import { addSlashes } from '../../../src/utils/Str'
import { spawnChild } from '../../../src/utils/process_'
import { DiagramFactory } from '../../../src/server/DiagramFactory';
import NodeFactory from '../../../src/server/NodeFactory';
import { Node } from '../../../src/server/Node';

async function cli($command, ...$args) {
	return await spawnChild(
		'node --trace-warnings',
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

test('simulate using the cli', async () => {
	let originalDiagram = DiagramBuilder.begin()
		.add(CreateJSON)
		.add(Inspect)
		.finish()

	let json = nonCircularJsonStringify(originalDiagram.serialize(), null, 4)

	let restoredDiagram = (new DiagramFactory).hydrate(
		JSON.parse(json)
	)

	const result: any = await restoredDiagram.run();

	// It returns a diagram
	expect(result.data.diagram).toBeInstanceOf(Diagram)

	let returnToJson = nonCircularJsonStringify(result.data.diagram.serialize())
	// It attaches features
	expect(result.data.diagram.nodes[1].features[0].original.resource).toBe('todos')
})

it('can run via cli', async () => {
	let diagram = DiagramBuilder.begin()
		.add(CreateJSON)
		.add(Inspect)
		.finish()

	const success = (results) => {
		let recreatedDiagram: any = (new DiagramFactory).hydrate(
			JSON.parse(results)
		)

		expect(recreatedDiagram.nodes[1].features[0].original.resource).toBe('todos')
	}

	const fail = (err) => {
		console.error("async error:\n" + err)
		throw 'Failed to run the CLI'
	}

	let json = nonCircularJsonStringify(diagram.serialize())

  await cli('run "' + addSlashes(json) + '"').then(success, fail)
});