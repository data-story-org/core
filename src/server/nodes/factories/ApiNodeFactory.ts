import { NodeFactory, NodeMap } from '../../NodeFactory';
import { HTTPRequest } from '../HTTPRequest';
import { SpecializedNodeFactory } from './SpecializedNodeFactory';

export class ApiNodeFactory
  implements SpecializedNodeFactory
{
  parentFactory: NodeFactory;

  constructor(parentFactory: NodeFactory) {
    this.parentFactory = parentFactory;
  }

  all(): NodeMap {
    const context = this.parentFactory.context;
    const apis = context.apis;
    if (!apis) return {};

    const nodes = {};

    for (const [key, endpoint] of Object.entries(apis)) {
      const node = new HTTPRequest({
        name: (endpoint as any).name,
        category: 'Workflow',
        description: 'Get API features',
        nodeType: HTTPRequest.name,
      });

      node.parameters = node.getDefaultParameters();
      node.setParameterValue('url', (endpoint as any).url);

      nodes[(endpoint as any).name] = node;
    }

    return nodes;
  }
}
