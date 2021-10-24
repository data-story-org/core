import { Node } from "../Node";
import { NodeParameter } from "../../NodeParameter";
import { DiagramRunResult } from "../Diagram";
import { Feature } from "../../Feature";
import { DiagramFactory } from "../DiagramFactory";
import { NodeFactory } from "../NodeFactory";

export class RunDiagram extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'RunDiagram',
			summary: 'Runs a stringified diagram. The diagram must have one Input node and one Output node.',
			category: 'Experimental',
			defaultInPorts: ['Input'],
			defaultOutPorts: ['Output', 'Failed'],			
			// Explicitly configured
			...options,
		})
	}

	async run() {
		const inputs = {
			Input: this.input('Input')
		}
		const diagram = this.getDiagram()
		let runResult: DiagramRunResult;

		try {
			runResult = await diagram.run(inputs)
			const output = runResult.diagram.getOutputFeatures()
			this.output(output)
		} catch(error) {
			this.output([new Feature(error.toString())], 'Failed')
		}
	}

	getDefaultParameters() {
		return [
			...super.getDefaultParameters(),
			NodeParameter.textarea('diagram')
				.withDescription('Json representation of a diagram'),
		]
	}
	
	getDiagram() {
		return (new DiagramFactory).hydrate(
			JSON.parse(this.getParameterValue('diagram')),
			new NodeFactory
		)
	}
}