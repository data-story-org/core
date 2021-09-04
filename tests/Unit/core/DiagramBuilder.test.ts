import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import { Diagram } from '../../../src/server/Diagram';
import { Create, Input, Inspect, Multiply, Output } from '../../../src/server/nodes';

it('can build diagrams programatically', () => {
  expect(
    DiagramBuilder.begin()
      .add(Create)
      .add(Inspect)
      .finish(),
  ).toBeInstanceOf(Diagram);
});

it('the created diagrams are runnable', async () => {
  let diagram = DiagramBuilder.begin()
    .add(Create)
    .add(Inspect)
    .finish();

  let result = await diagram.run();

  expect(diagram).toBeInstanceOf(Diagram);
});

it('the created diagrams are chained properly', async () => {
  let diagram = DiagramBuilder.begin()
		.add(Input)
		.add(Multiply)
		.add(Output)
		.finish()

  let n1 = diagram.findByName('Input')
	let n2 = diagram.findByName('Multiply')
	let n3 = diagram.findByName('Output')

	// expect to see n1--->n2--->n3 in dependency graph
	expect(diagram.dependsOn(n1,n2)).toBe(false)
	expect(diagram.dependsOn(n1,n3)).toBe(false)
	expect(diagram.dependsOn(n2,n1)).toBe(true)
	expect(diagram.dependsOn(n2,n3)).toBe(false)
	expect(diagram.dependsOn(n3,n1)).toBe(true)
	expect(diagram.dependsOn(n3,n2)).toBe(true)
});


