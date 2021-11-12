import { NodeParameter } from '../NodeParameter';
import { Node } from '../Node';
import { diagramRunResult } from '../Diagram';

export class Clone_ extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Clone_',
      summary: 'Make a set of clones',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(
      [
        this.input(),
        ...Array(
          parseInt(
            this.getParameterValue('number_of_clones'),
          ),
        ).fill(this.input()),
      ].flat(),
    );

    return diagramRunResult(this.diagram);
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.number('number_of_clones').withValue(
        10,
      ),
    ];
  }
}
