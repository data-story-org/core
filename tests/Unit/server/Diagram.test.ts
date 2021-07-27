import Diagram from '../../../src/server/Diagram';
import { DataStoryContext } from '../../../src/server/DataStoryContext';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import CreateJSON from '../../../src/server/nodes/CreateJSON';
import Inspect from '../../../src/server/nodes/Inspect';
import version from '../../../src/utils/version';

describe('Diagram context', () => {
	it('can create a Diagram without a explicit context', () => {
		let diagram = new Diagram();
		expect(diagram).toBeInstanceOf(Diagram);
	});
	
	it('may supply a context at creation', () => {
		let diagram = new Diagram({
			foo: 'bar',
		} as DataStoryContext);
	
		expect(diagram).toBeInstanceOf(Diagram);
		expect(diagram.context).toBeInstanceOf(Object);
		expect(diagram.context['foo']).toBe('bar');
	});
	
	it('may supply a context at a later stage', () => {
		let diagram = new Diagram();
		diagram.setContext({ foo: 'bar' } as DataStoryContext);
	
		expect(diagram).toBeInstanceOf(Diagram);
		expect(diagram.context).toBeInstanceOf(Object);
		expect(diagram.context['foo']).toBe('bar');
	});
})

describe('Diagram lifecycle', () => {
	it('can serialize', () => {
		let diagram = DiagramBuilder.begin()
			.add(CreateJSON)
			.add(Inspect)
			.finish()
	
		let serialized = diagram.serialize()

		console.log(serialized.links)
	
		expect(serialized.version).toBe(version)
	})
})