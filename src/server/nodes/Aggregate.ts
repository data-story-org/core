import { Node } from '../Node';
import NodeParameter from '../../NodeParameter';
import { groupBy } from '../../utils/Arr';
import { Feature } from '../../Feature';

export default class Aggregate extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Aggregate',
      summary: 'Group features by attribute',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const groupKey = this.getParameterValue('group_by');

    const key = [
      'original',
      ...(groupKey ? [groupKey] : []),
    ].join('.');

    const groups = groupBy(this.input(), key);
    const features = [];

    for (const value in groups) {
      features.push(
        new Feature({
          [groupKey]: value,
          features: groups[value].map(
            (feature) => feature.original,
          ),
        }),
      );
    }

    this.output(features);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('group_by'),
    ];
  }
}
