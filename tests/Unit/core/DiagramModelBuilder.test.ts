import { ServerDiagramBuilder } from '../../../src/server/ServerDiagramBuilder'
import ServerDiagram from '../../../src/server/ServerDiagram'
import Create from '../../../src/server/nodes/Create';
import Inspect from '../../../src/server/nodes/Inspect';

it('can build diagrams programatically', () => {	
	expect(ServerDiagramBuilder.begin()
		.add(Create)
		.add(Inspect)
		.finish()
	).toBeInstanceOf(ServerDiagram)
});

it('the created diagrams are runnable', async () => {	
	let diagram = ServerDiagramBuilder.begin()
		.add(Create)
		.add(Inspect)
		.finish()
	
	await diagram.run()

	console.log(diagram)
});