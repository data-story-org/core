import Node from '../Node';
import NodeParameter from '../../NodeParameter';
import { Feature } from '../../Feature';

export default class Sort extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Sort',
      summary: 'Sort features',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.getParameterValue('sort_context') == 'global'
      ? this.sortGlobal()
      : this.sortLocal();
  }

  sortGlobal() {
    const sortAttribute = this.getParameterValue(
      'sort_attribute',
    );

    this.output(
      this.input().sort((f1, f2) => {
        if (f1.get(sortAttribute) < f2.get(sortAttribute))
          return -1;
        if (f1.get(sortAttribute) === f2.get(sortAttribute))
          return 0;
        if (f1.get(sortAttribute) > f2.get(sortAttribute))
          return 1;
      }),
    );
  }

  sortLocal() {
    const sortAttribute = this.getParameterValue(
      'sort_attribute',
    );

    this.output(
      this.input().map((feature) => {
        return feature.get(sortAttribute).sort();
      }),
    );
  }

  getParameters() {
    return [
      ...super.getParameters(),
      NodeParameter.select('sort_context')
        .withOptions(['global' /*, "local"*/])
        .withValue('global'),
      NodeParameter.string(
        'sort_attribute',
      ).withDescription(
        'attribute to sort on, may use dot notation',
      ),
    ];
  }
}
