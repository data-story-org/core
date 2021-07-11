import Diagram from "./Diagram"
import Node from "./Node"

export class DiagramBuilder {
	currentNode?: Node
	diagram?: Diagram

	static begin() {
		return new this
	}

	add(nodeClass, parameterKeyValues = {}, config = {}) {
		let diagram = this.getDiagram()

		// let node = new Node(
		// 	{
		// 		...(new nodeClass).serialize(),
		// 		...config
		// 	}
		// )

		let node = new nodeClass;

		diagram.addNode(node)

		this.diagram = diagram

		this.currentNode = node

		return this.withParameters(parameterKeyValues)
	}

	withParameters(parameters: object) {
		for (const [name, value] of Object.entries(parameters)) {
			let parameter = this.currentNode.parameters.find(p => p.name == name)
			parameter.value = value
		}

		return this
	}

	finish() {
		return this.getDiagram()
	}

	protected getDiagram() {
		return this.diagram ?? new Diagram()
	}
}