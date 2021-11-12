import { Feature } from '../../Feature';
import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';

export class CreateJSON extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'CreateJSON',
      summary: 'Create features from JSON',
      category: 'Reader',
      defaultInPorts: [],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(
      JSON.parse(this.getParameterValue('features')).map(
        (item) => new Feature(item),
      ),
    );

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.json('features').withValue(
        '[{ "resource": "todos"}]',
      ),
    ];
  }
}
