import { DiagramBuilder } from '../../../../src/server/DiagramBuilder';
import { Create, CreateJSON, CreateSequence, Input, Inspect, Output } from '../../../../src/server/nodes';
import { RunDiagram } from '../../../../src/server/nodes/RunDiagram'
import { when } from "../NodeTester";
import { Feature } from '../../../../src/Feature';
import { nonCircularJsonStringify } from "../../../../src/utils/nonCircularJsonStringify"

const dummyDiagram = () => {
	return DiagramBuilder.begin()
		.add(Input)
		.add(Output)
		.finish()
};

const dummyDiagramJson = () => {
	return nonCircularJsonStringify(
		dummyDiagram().serialize()
	)
}

describe('RunDiagram node', () => {
	it('can run', async () => {
		await when(RunDiagram)
			.hasParameters({ diagram: dummyDiagramJson() })
			.assertCanRun()
			.finish()
	});

	it('works', async () => {
		const diagram = DiagramBuilder.begin()
			.add(Create)
			.add(RunDiagram, { diagram: dummyDiagramJson() })
			.add(Output)
			.finish()

		await diagram.run()

		expect(diagram.getOutputFeatures()).toStrictEqual([new Feature({ resource: 'todos' })])
	});
});