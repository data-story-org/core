import * as nodes from './nodes';
import { SerializedNode } from '../types/SerializedNode';
import {
  ApiNodeFactory,
  DefaultNodeFactory,
  ContextNodeFactory,
} from './nodes/factories';
import { Node } from './Node';
import { DataStoryContext } from './DataStoryContext';
import { DownloaderNode } from './DownloaderNode';
import { DataDownloadFunction } from '../types';

export type PrototypeMap = {
	[name: string]: any // TODO -> "typeof Node", reference classes not an instances
}

export type NodeMap = {
	[name: string]: Node
}

const prototypes: PrototypeMap = Object.keys(nodes).reduce((all, name) => {
	all[name] = nodes[name];
	return all;
}, {});
export class NodeFactory {
  context: DataStoryContext;
  prototypes = prototypes
  downloaderFunction: DataDownloadFunction;

  static withContext(context) {
    return new this(context);
  }

  constructor(context = {}) {
    this.context = context;
  }	

  withDownloader(downloaderFunction: DataDownloadFunction) {
    this.downloaderFunction = downloaderFunction;
    return this;
  }

  withNodes(nodes) {
    nodes.forEach((node) => {
      this.prototypes = {
        ...this.prototypes,
        [new node().nodeType]: node,
      };
    });
    return this;
  }

  defaultNodes(): NodeMap {
    return DefaultNodeFactory.make(this.prototypes);
  }

  apiNodes(): NodeMap {
    return ApiNodeFactory.make(this.context);
  }

  contextNodes(): NodeMap {
    return ContextNodeFactory.make(this.context);
  }

  all(): NodeMap {
    return {
      ...this.defaultNodes(),
      ...this.apiNodes(),
      ...this.contextNodes(),
    };
  }

  find(nodeType: string): Node {
    return this.all()[nodeType];
  }

  nodeDescriptions() {
    return Object.values(this.all()).map((node) =>
      node.serialize(),
    );
  }

  hydrate(
    node: SerializedNode,
    diagram = null,
  ): Node | DownloaderNode {
    const type = this.prototypes[node.nodeType];

    const hydratedNode = new type({
      ...node,
      diagram,
    });

    if (
      hydratedNode instanceof DownloaderNode &&
      this.downloaderFunction
    ) {
      hydratedNode.downloadData.downloaderFunction =
        this.downloaderFunction;
    }

    return hydratedNode;
  }
}
