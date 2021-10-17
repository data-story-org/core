import { NodeMap } from '../../NodeFactory';

export class DefaultNodeFactory {
  static make(nodes: {}): NodeMap {
    const instances = {};

    for (const name in nodes) {
      instances[name] = new nodes[name]();
    }

    return instances;
  }
}
