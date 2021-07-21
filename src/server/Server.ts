import NodeFactory from './NodeFactory';
import { BootPayload } from '../types/BootPayload';
import { Node } from './Node';
import { DiagramFactory } from './DiagramFactory';
import { SerializedDiagram } from '../types/SerializedDiagram';
import { Context } from './Context';

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
          availableNodes: NodeFactory.nodeDescriptions(),
        },
      });
    });
  }

  public async run(diagram: any) {
    return DiagramFactory.hydrate(
      diagram as SerializedDiagram
    ).run();
  }

  public async save(name: string, model: any) {
    return new Promise((success) => {
      return success(true);
    });
  }

  // protected nodeDescriptions(): object[] {
  //   return Object.values(NodeFactory.all()).map((node) =>
  //     (new node() as Node).serialize(),
  //   );
  // }
}
