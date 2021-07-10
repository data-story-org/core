// import ServerDiagram from "./ServerDiagram";
// import ServerNodeFactory from "./ServerNodeFactory";
// import { BootPayload } from "../types/BootPayload";

export class BearServer
{
    // public boot() {
    //     return new Promise<BootPayload>((callback) => {
    //         return callback({
    //             data: {
    //                 stories: [],
    //                 availableNodes: this.nodeDescriptions()                    
    //             }
    //         })
    //     })
    // }

    // public async run(diagram: any) {
    //     return ServerDiagram.hydrate(diagram.serialize(), ServerNodeFactory).run()
    // }

    // public async save(name: string, model: any) {

    //     return new Promise((success) => {

    //         return success(true)
    //     })
    // }

    // protected nodeDescriptions(): object[] {
    //     return ServerNodeFactory.all().map(node => (new node()).serialize())
    // }

	public hey() {
		return 'hiya!'
	}
}