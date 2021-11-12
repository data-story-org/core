import { Feature } from '../../Feature';
import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';

export class Group extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Group',
      summary:
        'Outputs one array feature per incoming set of features',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output([
      new Feature(this.input().map((f) => f.original)),
    ]);

    return diagramRunResult(this.diagram);
  }
}
