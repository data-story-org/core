import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';
import { NodeParameter } from '../NodeParameter';

export class Sleep extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Sleep',
      summary: 'Sleep x seconds',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(this.input());

    await this.sleep(
      parseInt(this.getParameterValue('seconds_to_sleep')) *
        1000,
    );

    return diagramRunResult(this.diagram);
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      const wait = setTimeout(() => {
        if (typeof wait !== 'undefined') {
          clearTimeout(wait);
        }
        resolve('Node complete');
      }, ms);
    });
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.number('seconds_to_sleep').withValue(5),
    ];
  }
}
