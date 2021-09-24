import { NodeFactory } from './NodeFactory';
import { BootPayload } from '../types/BootPayload';
import { DiagramFactory } from './DiagramFactory';
import { SerializedDiagram } from '../types/SerializedDiagram';
import { DataStoryContext } from './DataStoryContext';
import { DataDonwloadFunction } from '../types';
import { Story } from './Story';

export interface ServerOptions {
  downloaderFunction?: DataDonwloadFunction;
}

export class Server {
  context: DataStoryContext;
  nodeFactory: NodeFactory;
  diagramFactory: DiagramFactory;

  constructor(
    context: DataStoryContext = {},
    options?: ServerOptions,
  ) {
    this.context = context;
    this.nodeFactory = NodeFactory.withContext(
      context,
    ).withDownloader(options?.downloaderFunction);
    this.diagramFactory =
      DiagramFactory.withContext(context);
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
    return this.diagramFactory
      .hydrate(
        diagram as SerializedDiagram,
        this.nodeFactory,
      )
      .run();
  }

  public async save(story: Story<any>) {
    return new Promise((success) => {
      return success(true);
    });
  }
}
