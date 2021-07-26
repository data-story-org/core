import NodeParameter from '../../NodeParameter';
import { Feature } from '../../Feature';
import { Node } from '../Node';

export default class RemoveAttributes extends Node {
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
    ).split(',');

    this.output(
      this.input()
        .map((feature) => {
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

          if (Object.keys(filtered).length === 0) {
            return undefined;
          }
          return new Feature(filtered);
        })
        .filter((feature) => feature !== undefined),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string(
        'attributes to remove',
      ).withValue('resource,name'),
    ];
  }
}
