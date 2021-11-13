import { Node } from '../Node';
import { Feature } from '../../Feature';
import { NodeParameter } from '../NodeParameter';
import { diagramRunResult } from '../Diagram';

export class CreateAttribute extends Node {
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
    const toCreate = this.getParameterValue(
      'Atrribute & value to create',
    );

    const outputs = this.input().map((feature) => {
      toCreate.forEach((row) => {
        feature.set(
          feature.parse(row['Attribute']['value']),
          feature.parse(row['Value']['value']),
        );
      });

      return feature;
    });

    this.output(outputs);

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.row('Atrribute & value to create', [
        NodeParameter.string('Attribute').withPlaceholder(
          'attribute',
        ),
        NodeParameter.string('Value').withPlaceholder(
          'value',
        ),
      ]).repeatable(),
    ];
  }
}
