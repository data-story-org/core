import { NodeFactory } from './NodeFactory';
import { BootPayload } from '../types/BootPayload';
import { DiagramFactory } from './DiagramFactory';
import { SerializedDiagram } from '../types/SerializedDiagram';
import { DataStoryContext } from './DataStoryContext';

export class Server {
  context: DataStoryContext;
  nodeFactory: NodeFactory;

  constructor(context = {}) {
    this.context = context;
    this.nodeFactory = NodeFactory.withContext(context);
  }

  public boot(extraNodes?) {
    return new Promise<BootPayload>((callback) => {
      return callback({
        data: {
          stories: [],
          availableNodes: this.nodeFactory
            .withNodes(extraNodes ?? [])
            .nodeDescriptions(),
        },
      });
    });
  }

  public async run(
    diagram: SerializedDiagram,
  ): Promise<{}> {
    return DiagramFactory.withContext(this.context)
      .hydrate(
        diagram as SerializedDiagram,
        this.nodeFactory,
      )
      .run();
  }

  public async save(name: string, model: any) {
    return new Promise((success) => {
      return success(true);
    });
  }
}
