import { Node } from '../../../src/server/Node';
import {
  NodeFactory,
  NodeMap,
} from '../../../src/server/NodeFactory';

describe('NodeFactory', () => {
  const factory = () => {
    return new NodeFactory();
  };
  it('can instanciate', () => {
    expect(factory()).toBeInstanceOf(NodeFactory);
  });

  it('can get all nodes as a NodeMap', () => {
    const nodes: NodeMap = factory().all();

    Object.entries(nodes).forEach(([_nodeType, node]) => {
      expect(node).toBeInstanceOf(Node);
    });
  });
});
