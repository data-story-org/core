import Diagram from '../../../src/server/Diagram';
import { Context } from '../../../src/server/Context';

it('can create a Diagram without a explicit context', () => {
	let diagram = new Diagram()
	expect(diagram).toBeInstanceOf(Diagram)
});

it('may supply a context at creation', () => {
	let diagram = new Diagram(new Context({foo: 'bar'}))

	expect(diagram).toBeInstanceOf(Diagram)
	expect(diagram.context).toBeInstanceOf(Context)
	expect(diagram.context['foo']).toBe('bar')
});

it('may supply a context at a later stage', () => {
	let diagram = new Diagram()
	diagram.setContext(new Context({foo: 'bar'}))

	expect(diagram).toBeInstanceOf(Diagram)
	expect(diagram.context).toBeInstanceOf(Context)
	expect(diagram.context['foo']).toBe('bar')	
});