export class DefaultNodeFactory {
	static make(nodes: any[]) {
		return nodes.reduce((all, node) => {
			let instance = new node()
			all[instance.name] = instance
			return all
		}, {})
	}		
}