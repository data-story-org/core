import { Feature } from '../../Feature';
import Node from '../Node';

export default class Group extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Group',
      summary: 'Outputs one array feature per incoming set of features',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    this.output([new Feature(this.input().map((f) => f.original))]);
  }
}
