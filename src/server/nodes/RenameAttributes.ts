import { NodeParameter } from '../../NodeParameter';
import { Feature } from '../../Feature';
import { Node } from '../Node';

const clone = (obj) => Object.assign({}, obj);

const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];

  delete clonedObj[key];
  clonedObj[newKey] = targetKey;

  return clonedObj;
};

export default class RenameAttributes extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'RenameAttributes',
      summary: 'Renames configured attributes',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const toRename = this.getParameterValue(
      'Attributes to rename',
    );

    // Convert our results from frontend into
    // an extremely fast and usefull map in format of
    // previousAttributeName => nextAttributeName
    //
    // Map {
    //     "resource" => "globalResource",
    //     'globalId' => "GLOBALID",
    //     ...,
    //     "n"        => "N"
    // }
    const renameMap = new Map();

    toRename.map((result) => {
      renameMap.set(
        result['input']['value'],
        result['output']['value'],
      );
    });

    this.output(
      this.input().map((feature) => {
        const { original } = feature;

        let filtered = original;

        Object.keys(filtered).forEach((key) => {
          renameMap.has(key)
            ? (filtered = renameKey(
                filtered,
                key,
                renameMap.get(key),
              ))
            : null;
        });

        return new Feature(filtered);
      }),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.row('Attributes to rename', [
        NodeParameter.string('input').withValue(
          'Attribute',
        ),
        NodeParameter.string('output').withValue(
          'New name',
        ),
      ]).repeatable(),
    ];
  }
}
