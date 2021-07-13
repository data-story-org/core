import Node from '../Node';
import NodeParameter from '../../NodeParameter';

export default class Comment extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Comment',
      summary: 'Add a comment',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: [],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    return null;
  }

  getParameters() {
    return [
      ...super.getParameters(),
      NodeParameter.string('text').withValue(
        'This is a comment',
      ),
    ];
  }
}
