import Diagram from './Diagram';
import NodeFactory from './NodeFactory';
import { BootPayload } from '../types/BootPayload';

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
    return Diagram.hydrate(diagram.serialize(), NodeFactory).run();
  }

  public async save(name: string, model: any) {
    return new Promise((success) => {
      return success(true);
    });
  }

  protected nodeDescriptions(): object[] {
    return NodeFactory.all().map((node) => new node().serialize());
  }

  public hey() {
    return 'hiya!';
  }
}
