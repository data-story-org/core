import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';
import { Feature } from '../../Feature';

export class OutputProvider extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'OutputProvider',
      summary: 'Provides output ports from JSON',
      category: 'Workflow',
      editableOutPorts: true,
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    let outputs = this.getParameterValue('outputs')
      ? this.getParameterValue('outputs')
      : {};

    // It can accept json string or object
    if (typeof outputs == 'string')
      outputs = JSON.parse(outputs);

    for (const [key, value] of Object.entries(outputs)) {
      this.output(
        (value as any[]).map((v) => new Feature(v)),
        key,
      );
    }
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.js('outputs').withValue(''),
    ];
  }
}
