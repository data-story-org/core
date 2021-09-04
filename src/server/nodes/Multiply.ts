import { Node } from "../Node";
import { NodeParameter } from "../../NodeParameter";

export class Multiply extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'Multiply',
			summary: 'Multiply incoming features by a factor',
			category: 'Workflow',
			defaultInPorts: ['Input'],
			defaultOutPorts: ['Output'],			
			// Explicitly configured
			...options,
		})
	}

    async run() {
        const factor = this.getParameterValue('factor')
        
        this.output(
            this.input().map(feature => {
							feature.original *= factor
							return feature
						})
        )
    }

	getDefaultParameters() {
		return [
			...super.getDefaultParameters(),
            NodeParameter.number('factor').withValue(2),
		]
	}     
}