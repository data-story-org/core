import Diagram from '../../../src/server/Diagram';
import { DataStoryContext } from '../../../src/server/DataStoryContext';

it('can create a Diagram without a explicit context', () => {
  let diagram = new Diagram();
  expect(diagram).toBeInstanceOf(Diagram);
});

it('may supply a context at creation', () => {
  let diagram = new Diagram({ foo: 'bar' } as DataStoryContext);

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
