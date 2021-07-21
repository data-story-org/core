import ResolveContextFeatures from "../ResolveContextFeatures"

export class ContextNodeFactory {
	static make(context: any) {
		const models = context.models
		if(!models) return {}

		let nodes = {}

		for (let [key, _] of Object.entries(models)) {
			let node = new ResolveContextFeatures({
				name: key,
				category: 'Model',
				description: 'Resolve features from context',
				nodeType: ResolveContextFeatures.name
			})

			// This is done because features dont recieve their parameters at instanciation but first at serialization due to constructors cant use childs methods :/
			node.parameters = node.getDefaultParameters()
			node.setParameterValue('path_to_features', 'models.' + key)

			nodes[key] = node
  	}

		return nodes
	}		
}