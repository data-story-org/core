import Diagram from '../../../src/server/Diagram';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import NodeFactory from '../../../src/server/NodeFactory';
import Clone_ from '../../../src/server/nodes/Clone_';
import Create from '../../../src/server/nodes/Create';
import { Server } from '../../../src/server/Server';
import { SerializedDiagram } from '../../../src/types/SerializedDiagram';
import sample from '../../sampleDiagram.json'
import { DiagramFactory } from '../../../src/server/DiagramFactory'

test('the JS server can boot', () => {
  let server = new Server();

  expect(server.boot()).toBeInstanceOf(Object);
});

test('the JS server can run', async () => {
	let diagram = DiagramBuilder.begin()
		.add(Create)
		.add(Clone_)
		.finish()

		let result = await diagram.run()

		expect(result).toBeInstanceOf(Object)
});

test('the GUI can run', async () => {
	let diagram = DiagramFactory.hydrate(sample as SerializedDiagram, NodeFactory)

		let result = await diagram.run()

		expect(result).toBeInstanceOf(Object)
});