import Diagram from '../../../src/server/Diagram';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import NodeFactory from '../../../src/server/NodeFactory';
import Clone_ from '../../../src/server/nodes/Clone_';
import Create from '../../../src/server/nodes/Create';
import { Server } from '../../../src/server/Server';
import { SerializedDiagram } from '../../../src/types/SerializedDiagram';
import sample from '../../sampleDiagram.json';
import { DiagramFactory } from '../../../src/server/DiagramFactory';
import { SerializedNodeModel } from '../../../src/types/SerializedNodeModel';

test('the JS server can boot', async () => {
  let server = new Server();

  expect(await server.boot()).toBeInstanceOf(Object);
});

test('it will provide custom nodes when given a context with models', async () => {
  let server = new Server({
		models: {
			cars: ['Volvo', 'Saab', 'Koenigsegg']
		}
	});

	let { data } = await server.boot()
	let carsNode = data.availableNodes.find(node => (node as SerializedNodeModel).name == 'cars')

  expect((carsNode as SerializedNodeModel).name).toBe('cars');
	expect((carsNode as SerializedNodeModel).nodeType).toBe('ResolveContextFeatures');
})

test('the JS server can run', async () => {
  let diagram = DiagramBuilder.begin()
    .add(Create)
    .add(Clone_)
    .finish();

  let result = await diagram.run();

  expect(result).toBeInstanceOf(Object);
});

test('the GUI can run', async () => {
  let diagram = (new DiagramFactory).hydrate(
    sample as SerializedDiagram,
  );

  let result = await diagram.run();

  expect(result).toBeInstanceOf(Object);
});
