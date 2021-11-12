import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';

export class Sample extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Sample',
      summary: 'Sample first N features',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(
      this.input().slice(
        0,
        this.getParameterValue('first_n_features'),
      ),
    );

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.number('first_n_features').withValue(
        100,
      ),
    ];
  }
}
