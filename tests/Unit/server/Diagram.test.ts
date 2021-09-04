import { Diagram } from '../../../src/server/Diagram';
import { DataStoryContext } from '../../../src/server/DataStoryContext';
import { DiagramBuilder } from '../../../src/server/DiagramBuilder';
import {
  CreateJSON,
  CreateSequence,
  Inspect,
	Output,
} from '../../../src/server/nodes';
import version from '../../../src/utils/version';
import { Feature } from '../../../src/Feature';

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
});

describe('Diagram lifecycle', () => {
  it('can serialize', () => {
    let diagram = DiagramBuilder.begin()
      .add(CreateJSON)
      .add(Inspect)
      .finish();

    let serialized = diagram.serialize();

    expect(serialized.version).toBe(version);
  });


	describe('Outputs', () => {
		function getDiagram(): Diagram {
			return DiagramBuilder.begin()
      .add(CreateJSON)
      .add(Output)
      .finish();
		}

		const emptyOutput = []
		const defaultOutput = [{resource: 'todos'}]
		const defaultOutputFeatures = [new Feature({resource: 'todos'})]		

		it('can provide raw output suitable for external usage', async () => {
			let beforeRunning = getDiagram().getOutput();
			expect(beforeRunning).toStrictEqual(emptyOutput);
			
			let afterRunning = (await getDiagram().run() as any).data.diagram.getOutput()
			expect(afterRunning).toStrictEqual(defaultOutput);
	
			let explicit = (await getDiagram().run() as any).data.diagram.getOutput('Output')
			expect(explicit).toStrictEqual(defaultOutput);		
		});

		it('can provide output suitable for node and diagram chaining', async () => {
			let beforeRunning = getDiagram().getOutputFeatures();
			expect(beforeRunning).toStrictEqual(emptyOutput);
			
			let afterRunning = (await getDiagram().run() as any).data.diagram.getOutputFeatures()
			expect(afterRunning).toStrictEqual(defaultOutputFeatures);
	
			let explicit = (await getDiagram().run() as any).data.diagram.getOutputFeatures('Output')
			expect(explicit).toStrictEqual(defaultOutputFeatures);		
		});		
	})
});
