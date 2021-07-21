export class DefaultNodeFactory {
	static make(nodes: {}): Record<string, unknown> {
		let instances = {}

		for (const name in nodes) {
			instances[name] = new nodes[name]
		}

		return instances
	}		
}
