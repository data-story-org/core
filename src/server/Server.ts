import NodeFactory from './NodeFactory';
import { BootPayload } from '../types/BootPayload';
import { DiagramFactory } from './DiagramFactory';
import { SerializedDiagram } from '../types/SerializedDiagram';

export class Server {
	context

	constructor(context = {}) {
		this.context = context
	}

  public boot() {
    return new Promise<BootPayload>((callback) => {
      return callback({
        data: {
          stories: [],
          availableNodes: (NodeFactory.withContext(this.context)).nodeDescriptions(),
        },
      });
    });
  }

  public async run(diagram: any) {
    return DiagramFactory.withContext(this.context).hydrate(
      diagram as SerializedDiagram
    ).run();
  }

  public async save(name: string, model: any) {
    return new Promise((success) => {
      return success(true);
    });
  }
}
