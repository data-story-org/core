import Diagram from './Diagram';
import NodeFactory from './NodeFactory';
import { BootPayload } from '../types/BootPayload';
import { Node } from './Node';
import { DiagramFactory } from './DiagramFactory';
import { SerializedDiagram } from '../types/SerializedDiagram';

export class Server {
  public boot() {
    return new Promise<BootPayload>((callback) => {
      return callback({
        data: {
          stories: [],
          availableNodes: this.nodeDescriptions(),
        },
      });
    });
  }

  public async run(diagram: any) {
    return DiagramFactory.hydrate(
      diagram as SerializedDiagram,
      NodeFactory,
    ).run();
  }

  public async save(name: string, model: any) {
    return new Promise((success) => {
      return success(true);
    });
  }

  protected nodeDescriptions(): object[] {
    return NodeFactory.all().map((node) =>
      (new node() as Node).serialize(),
    );
  }
}
