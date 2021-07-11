import { Feature } from "../../Feature";
import Node from "../Node";
import NodeParameter from "../../NodeParameter";

export default class Map extends Node {
	constructor(options = {}) {
		super({
			// Defaults
			name: 'Map',
			summary: 'Map into a property',
			category: 'Workflow',
			defaultInPorts: ['Input'],
			defaultOutPorts: ['Output'],			
			// Explicitly configured
			...options,
		})
	}    

    async run() {
        const property = this.getParameterValue('property');
        const paths = property.split('.')

        this.output(
            this.input().map(item => {
                let mapped = paths.reduce((carry, path) => {
                    return carry[path]
                }, item.original)

                return new Feature(mapped)
            })
        );
    }
	
	getParameters() {
		return [
			...super.getParameters(),
            NodeParameter.string('property').withValue('data'),            
		]
	}	
}