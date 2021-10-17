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
import { SpecializedNodeFactory } from './nodes/factories/SpecializedNodeFactory';

export type PrototypeMap = {
  [name: string]: any; // TODO -> "typeof Node", reference classes not instances
};

export type NodeMap = {
  [name: string]: Node;
};

export class NodeFactory {
  context: DataStoryContext;
  prototypes: PrototypeMap = nodes;
  downloaderFunction: DataDownloadFunction;
  factories: any[] = [
    // TODO "~~SpecializedNodeFactory[]", reference classes not instances
    DefaultNodeFactory,
    ApiNodeFactory,
    ContextNodeFactory,
  ];

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

  all(): NodeMap {
    return this.factories.reduce((all, subFactory) => {
      return {
        ...all,
        ...new subFactory(this).all(),
      };
    }, {});
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
