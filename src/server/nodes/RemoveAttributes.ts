import { NodeParameter } from '../../NodeParameter';
import { Feature } from '../../Feature';
import { Node } from '../Node';

export class RemoveAttributes extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'RemoveAttributes',
      summary: 'Removes configured attributes',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const toRemove = this.getParameterValue(
      'attributes to remove',
    );

    this.output(
      this.input().map((feature) => {
        const { original } = feature;

        const filtered = Object.keys(original)
          .filter((key) => !toRemove.includes(key))
          .reduce(
            (obj, key) => ({
              ...obj,
              [key]: original[key],
            }),
            {},
          );

        return new Feature(filtered);
      }),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('Attributes to remove')
        .withPlaceholder('Attribute name')
        .repeatable(),
    ];
  }
}
