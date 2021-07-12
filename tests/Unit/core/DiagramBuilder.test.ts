import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import Diagram from '../../../src/server/Diagram';
import Create from '../../../src/server/nodes/Create';
import Inspect from '../../../src/server/nodes/Inspect';

it('can build diagrams programatically', () => {
  expect(DiagramBuilder.begin().add(Create).add(Inspect).finish()).toBeInstanceOf(Diagram);
});

it('the created diagrams are runnable', async () => {
  let diagram = DiagramBuilder.begin().add(Create).add(Inspect).finish();

  let result = await diagram.run();

  expect(diagram).toBeInstanceOf(Diagram);
});
