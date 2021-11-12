import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';

export class Input extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Input',
      summary: 'Provide story input',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(this.features);

    return diagramRunResult(this.diagram);
  }
}
