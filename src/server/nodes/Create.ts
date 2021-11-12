import { Node } from '../Node';
import { Feature } from '../../Feature';
import { NodeParameter } from '../NodeParameter';
import { diagramRunResult } from '../Diagram';

export class Create extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Create',
      summary: 'Create a feature',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const featurType =
      this.getParameterValue('feature_type');
    const contents = this.getParameterValue('contents');

    if (featurType == 'null') {
      this.output([new Feature()]);
    }

    if (featurType == 'object') {
      this.output([new Feature(JSON.parse(contents))]);
    }

    if (featurType == 'float') {
      this.output([new Feature(parseFloat(contents))]);
    }

    if (featurType == 'integer') {
      this.output([new Feature(parseInt(contents))]);
    }

    if (featurType == 'string') {
      this.output([new Feature(contents)]);
    }

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.select('feature_type')
        .withOptions([
          'null',
          'object',
          'float',
          'integer',
          'string',
        ])
        .withValue('object'),
      NodeParameter.json('contents').withValue(
        '{"resource": "todos"}',
      ),
    ];
  }
}
