import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';

export class Inspect extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Inspect',
      summary: 'Display features in a table',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: [],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.features = this.input();

    return diagramRunResult(this.diagram);
  }
}
