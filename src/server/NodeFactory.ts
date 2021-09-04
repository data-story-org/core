import * as nodes from './nodes'
import { SerializedNode } from '../types/SerializedNode';
import {
  ApiNodeFactory,
  DefaultNodeFactory,
  ContextNodeFactory,
} from './nodes/factories';
import { Node } from './Node';
import { DataStoryContext } from './DataStoryContext';

export class NodeFactory {
  context: DataStoryContext;
  prototypes = Object.keys(nodes).reduce((all, name) => {
		return all[name] = nodes[name]
	}, {})

  static withContext(context) {
    return new this(context);
  }

  constructor(context = {}) {
    this.context = context;
  }

  defaultNodes(): {} {
    return DefaultNodeFactory.make(this.prototypes);
  }

  apiNodes(): {} {
    return ApiNodeFactory.make(this.context);
  }

  contextNodes() {
    return ContextNodeFactory.make(this.context);
  }

  all(): object {
    return {
      ...this.defaultNodes(),
      ...this.apiNodes(),
      ...this.contextNodes(),
    };
  }

  find(nodeType) {
    return this.all()[nodeType];
  }

  nodeDescriptions() {
    return Object.values(this.all()).map((node) =>
      node.serialize(),
    );
  }

  hydrate(node: SerializedNode, diagram = null): Node {
    const type = this.prototypes[node.nodeType];

    return new type({
      ...node,
      diagram,
    });
  }
}
