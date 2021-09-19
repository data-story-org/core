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
import { DataDonwloadFunction } from '../types';

export class NodeFactory {
  context: DataStoryContext;
  prototypes = Object.keys(nodes).reduce((all, name) => {
    all[name] = nodes[name];
    return all;
  }, {});
  downloaderFunction: DataDonwloadFunction;

  static withContext(context) {
    return new this(context);
  }

  withDownloader(downloaderFunction: DataDonwloadFunction) {
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
