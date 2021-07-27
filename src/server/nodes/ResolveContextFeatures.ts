import { Node } from '../Node';
import NodeParameter from '../../NodeParameter';
import { Feature } from '../../Feature';

export default class ResolveContextFeatures extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'ResolveContextFeatures',
      summary: 'Resolve features from a context path',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const pathToFeatureData = this.getParameterValue(
      'path_to_features',
    );
    const parts = pathToFeatureData.split('.');

    const featureData = parts.reduce((carry, path) => {
      return carry[path];
    }, this.diagram.context);

    this.output(
      (featureData as unknown[]).map((data) => new Feature(data)),
    );
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string(
        'path_to_features',
      ).withDescription('you may use dot notated paths'),
    ];
  }
}
