import { Node } from '../Node';
import NodeParameter from '../../NodeParameter';

export default class CreateAttribute extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'CreateAttribute',
      summary: 'Create a new attribute from an expression',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const attribute = this.getParameterValue('attribute');
    const value = this.getParameterValue('value');

    this.output(
      this.input().map((feature) =>
        feature.set(attribute, value),
      ),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute'),
      NodeParameter.string('value'),
    ];
  }
}
