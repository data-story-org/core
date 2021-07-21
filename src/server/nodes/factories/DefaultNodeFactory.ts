export class DefaultNodeFactory {
	static make(nodes): {} {
		let instances = {}

		for (var name in nodes) {
			instances[name] = new nodes[name]
		}

		return instances
	}		
}