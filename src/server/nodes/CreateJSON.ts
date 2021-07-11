import { Feature } from "../../Feature";
import Node from "../Node";
import NodeParameter from "../../NodeParameter";

export default class CreateJSON extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'CreateJSON',
			summary: 'Create features from JSON',
			category: 'Reader',
			defaultInPorts: [],
			defaultOutPorts: ['Output'],			
			// Explicitly configured
			...options,
		})
	}

    async run() {
        this.output(
            JSON.parse(this.getParameterValue('features'))
                .map(item => new Feature(item))
        );
    }

	getParameters() {
		return [
			...super.getParameters(),
            NodeParameter.json('features').withValue('[{ "resource": "todos"}]'),            
		]
	}	
}