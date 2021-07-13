import { Node } from '../Node';

export default class Inspect extends Node {
  public features: any[];

  constructor(options = {}) {
    super({
      // Defaults
      name: 'Inspect',
      summary: 'Display features in a table',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: [],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.features = this.input();
  }
}
