import { Node } from '../../../src/server/Node';
import {
  NodeFactory,
  NodeMap,
} from '../../../src/server/NodeFactory';
import { Create } from '../../../src/server/nodes';

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

  it('can create a specific node', () => {
    const node = factory().find('Create');

    expect(node).toBeInstanceOf(Create);
  });
});
