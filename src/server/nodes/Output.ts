import { Node } from "../Node";
import { NodeParameter } from "../../NodeParameter";

export class Output extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'Output',
			summary: 'Provide story output',
			category: 'Workflow',
			defaultInPorts: ['Input'],
			defaultOutPorts: [],			
			// Explicitly configured
			...options,
		})
	}

	async run() {
		this.features = this.input()
	}
}