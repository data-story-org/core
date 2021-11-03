import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';
import { Feature } from '../../Feature';

export class Multiply extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Multiply',
      summary: 'Multiply incoming features by a factor',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const factor = this.getParameterValue('factor');

    this.output(
      this.input().map((feature) => {
        return new Feature(
          (feature.original ?? feature) * factor,
        );
      }),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.number('factor').withValue(2),
    ];
  }
}
