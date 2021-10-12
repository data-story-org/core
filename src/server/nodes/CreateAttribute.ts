import { Node } from '../Node';
import { Feature } from '../../Feature';
import { NodeParameter } from '../../NodeParameter';

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

    const valuesMap = new Map();

    toCreate.map((result) => {
      valuesMap.set(
        result['Attribute']['value'],
        result['Value']['value'],
      );
    });

    this.output(
      this.input().map((feature) => {
        const { original } = feature;

        let filtered = original;
        for (const [attr, v] of valuesMap) {
          filtered = Object.assign(filtered, { [attr]: v });
        }

        return new Feature(filtered);
      }),
    );
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
