import { SerializedDiagram } from '../types/SerializedDiagram';
import { SerializedNodeModel } from '../types/SerializedNodeModel';
import { DataStoryContext } from './DataStoryContext';
import Diagram from './Diagram';
import { Link } from './Link';
import NodeFactory from './NodeFactory';
import { Port } from './Port';

export class DiagramFactory {
	context: DataStoryContext

	static withContext(context: DataStoryContext) {
		return new this(context)
	}

	constructor(context: DataStoryContext = {}) {
		this.context = context
	}

  hydrate(payload: string | SerializedDiagram): Diagram {
    const data: SerializedDiagram =
      typeof payload == 'string'
        ? JSON.parse(payload)
        : payload;

    // Create empty diagram
    const diagram = new Diagram(this.context);

    // Add Nodes
    diagram.nodes = Object.values(
      data.layers[1].models,
    ).map((node: SerializedNodeModel) => {
      return (new NodeFactory).hydrate(node, diagram);
    });

    // Add Links
    diagram.links = Object.values(
      data.layers[0].models,
    ).map((data: any) => {
      return new Link({
        id: data.id,
        sourcePort: diagram.find(data.sourcePort) as Port,
        targetPort: diagram.find(data.targetPort) as Port,
      });
    });

    return diagram;
  }
}
