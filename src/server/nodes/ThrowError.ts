import { NodeParameter } from '../NodeParameter';
import { Node } from '../Node';
import { diagramRunResult } from '../Diagram';

export class ThrowError extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'ThrowError',
      summary: 'Throws an error',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: [],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    if (this.input().length)
      throw Error(this.getParameterValue('error_message'));

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('error_message').withValue(
        'Something went wrong!',
      ),
    ];
  }
}
