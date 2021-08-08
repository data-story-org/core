import { Node } from "../Node";
import { NodeParameter } from "../../NodeParameter";

export default class Filter extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'Filter',
			summary: 'Filter nodes by attribute name',
			category: 'Workflow',
			defaultInPorts: ['Input'],
			defaultOutPorts: ['Output'],			
			// Explicitly configured
			...options,
		})
	}

    async run() {
        const p1 = this.getParameterValue('name')
        
        this.output(
            this.input()
        )
    }

	getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
				NodeParameter.string('attribute').withValue('name').withDescription('attribute to match against'),
				NodeParameter.row('Output ports', [
					NodeParameter.string('port')
					// NodeParameter.select('operator').withOptions(['==']).withValue('=='),
      ]).repeatable(),
    ];
	}     
}