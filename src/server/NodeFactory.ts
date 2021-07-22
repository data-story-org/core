import Aggregate from './nodes/Aggregate';
import Clone_ from './nodes/Clone_';
import Comment from './nodes/Comment';
import Create from './nodes/Create';
import CreateGrid from './nodes/CreateGrid';
import CreateAttribute from './nodes/CreateAttribute';
import CreateCSV from './nodes/CreateCSV';
import CreateJSON from './nodes/CreateJSON';
import CreateSequence from './nodes/CreateSequence';
// import DownloadCSV from './nodes/DownloadCSV'
// import DownloadJSON from './nodes/DownloadJSON'
// import DownloadGeoJSON from './nodes/DownloadGeoJSON'
import Evaluate from './nodes/Evaluate';
import FilterDuplicates from './nodes/FilterDuplicates';
import Flatten from './nodes/Flatten';
import Group from './nodes/Group';
import HTTPRequest from './nodes/HTTPRequest';
import Inspect from './nodes/Inspect';
import Log from './nodes/Log';
import Map from './nodes/Map';
import OutputProvider from './nodes/OutputProvider';
import RegExpFilter from './nodes/RegExpFilter';
import ResolveContextFeatures from './nodes/ResolveContextFeatures';
// import DeleteRepositories from './nodes/github/DeleteRepositories'
// import Repositories from './nodes/github/Repositories'
import Sample from './nodes/Sample';
import Sort from './nodes/Sort';
import Sleep from './nodes/Sleep';
import ThrowError from './nodes/ThrowError';

import { SerializedNodeModel } from '../types/SerializedNodeModel';
import { ApiNodeFactory } from './nodes/factories/ApiNodeFactory';
import { DefaultNodeFactory } from './nodes/factories/DefaultNodeFactory';
import { ContextNodeFactory } from './nodes/factories/ContextNodeFactory';
import { Node } from './Node';
import { DataStoryContext } from './DataStoryContext';

export default class NodeFactory {
  context: DataStoryContext;
  prototypes = {
    Aggregate,
    Clone_,
    Comment,
    Create,
    CreateAttribute,
    CreateCSV,
    CreateGrid,
    CreateJSON,
    CreateSequence,
    Evaluate,
    FilterDuplicates,
    Flatten,
    Group,
    HTTPRequest,
    Inspect,
    Log,
    Map,
    OutputProvider,
    RegExpFilter,
    ResolveContextFeatures,
    Sample,
    Sleep,
    Sort,
    ThrowError,
  };

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

  hydrate(node: SerializedNodeModel, diagram = null) {
    const type = this.prototypes[node.nodeType];

    return new type({
      ...node,
      diagram,
    });
  }
}
