export class DefaultNodeFactory {
	static make(nodes: any[]) {
		return nodes.reduce((all, node) => {
			all[node.nodeType] = node
		}, {})
	}		
}