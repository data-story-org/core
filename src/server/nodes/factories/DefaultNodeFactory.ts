import { NodeFactory, NodeMap, PrototypeMap } from '../../NodeFactory';
import { SpecializedNodeFactory } from './SpecializedNodeFactory';

export class DefaultNodeFactory implements SpecializedNodeFactory {
	parentFactory: NodeFactory

	constructor(parentFactory: NodeFactory) {
		this.parentFactory = parentFactory
	}

  all(): NodeMap {	
    const instances = {};
		const nodes: PrototypeMap = this.parentFactory.prototypes

    for (const name in nodes) {
      instances[name] = new nodes[name]();
    }

    return instances;
  }
}
