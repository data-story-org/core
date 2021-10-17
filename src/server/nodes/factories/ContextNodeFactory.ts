import { DataStoryContext } from '../../DataStoryContext';
import { NodeFactory, NodeMap } from '../../NodeFactory';
import { ResolveContextFeatures } from '../ResolveContextFeatures';
import { SpecializedNodeFactory } from './SpecializedNodeFactory';

export class ContextNodeFactory implements SpecializedNodeFactory {
	parentFactory: NodeFactory

	constructor(parentFactory: NodeFactory) {
		this.parentFactory = parentFactory
	}

  all(): NodeMap {
		const context = this.parentFactory.context
    const models = context.models;
    if (!models) return {};

    const nodes = {};

    for (const [key, _] of Object.entries(models)) {
      const node = new ResolveContextFeatures({
        name: key,
        category: 'Model',
        description: 'Resolve features from context',
        nodeType: ResolveContextFeatures.name,
      });

      // This is done because features dont recieve their parameters at instanciation but first at serialization due to constructors cant use childs methods :/
      node.parameters = node.getDefaultParameters();
      node.setParameterValue(
        'path_to_features',
        'models.' + key,
      );

      nodes[key] = node;
    }

    return nodes;
  }
}
