import { DiagramBuilder } from '../../../../src/server/DiagramBuilder';
import {
  Create,
  CreateJSON,
  CreateSequence,
  Input,
  Inspect,
  Output,
} from '../../../../src/server/nodes';
import { RunDiagram } from '../../../../src/server/nodes/RunDiagram';
import { when } from '../NodeTester';
import { Feature } from '../../../../src/Feature';
import { nonCircularJsonStringify } from '../../../../src/utils/nonCircularJsonStringify';

const dummyDiagramJson = () => {
  const diagram = DiagramBuilder.begin()
    .add(Input)
    .add(Output)
    .finish();

  return nonCircularJsonStringify(diagram.serialize());
};

describe('RunDiagram node', () => {
  it('can run', async () => {
    await when(RunDiagram)
      .hasParameters({ diagram: dummyDiagramJson() })
      .assertCanRun()
      .finish();
  });

  it('will pass on inputs to outputs', async () => {
    const diagram = DiagramBuilder.begin()
      .add(Create)
      .add(RunDiagram, { diagram: dummyDiagramJson() })
      .add(Output)
      .finish();

    await diagram.run();

    expect(diagram.getOutputFeatures()).toStrictEqual([
      new Feature({ resource: 'todos' }),
    ]);
  });
});
