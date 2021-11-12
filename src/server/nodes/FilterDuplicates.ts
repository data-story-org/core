import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';
import { Feature } from '../../Feature';
import { diagramRunResult } from '../Diagram';

export class FilterDuplicates extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'FilterDuplicates',
      summary: 'Remove duplicates',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(this.uniqueFeatures(this.input()));

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute').withDescription(
        'attribute to filter on, may use dot notation',
      ),
    ];
  }

  uniqueFeatures(all) {
    const attribute = this.getParameterValue('attribute');
    const prims = { boolean: {}, number: {}, string: {} },
      objs = [];
    const uniqueFeatures = [];

    all.forEach(function (feature) {
      let comparable = attribute
        .split('.')
        .reduce((traversed, part) => {
          return part ? traversed[part] : traversed;
        }, feature.original);
      const type = typeof comparable;

      if (type in prims) {
        // if (!prims[type].hasOwnProperty(comparable)) {
        if (
          !Object.prototype.hasOwnProperty.call(
            prims[type],
            comparable,
          )
        ) {
          uniqueFeatures.push(feature);
          prims[type][comparable] = true;
        }
      } else {
        // // Strict does not work
        // if(objs.indexOf(comparable) == -1) {
        // 	uniqueFeatures.push(feature)
        // 	objs.push(comparable);
        // }

        // Cheat by comparing JSON
        comparable = JSON.stringify(comparable);
        if (objs.indexOf(comparable) == -1) {
          uniqueFeatures.push(feature);
          objs.push(comparable);
        }
      }
    });

    return uniqueFeatures;
  }
}
