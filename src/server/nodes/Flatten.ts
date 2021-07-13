import { Feature } from '../../Feature';
import { Node } from '../Node';

export default class Flatten extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Flatten',
      summary: 'Flatten arrays',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output(
      this.input()
        .map((item) => item.original)
        .flat()
        .map((item) => new Feature(item)),
    );
  }
}
