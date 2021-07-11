import DiagramModel from '../../../src/DiagramModel';
import { DiagramModelBuilder } from '../../../src/DiagramModelBuilder'
import Create from '../../../src/server/nodes/Create';
import Inspect from '../../../src/server/nodes/Inspect';

it('can build diagrams programatically', () => {	
	expect(DiagramModelBuilder.begin()
		.add(Create)
		.add(Inspect)
		.finish()
	).toBeInstanceOf(DiagramModel)
});