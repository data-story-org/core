import { SerializedDiagram } from '../types/SerializedDiagram';
import { SerializedNode } from '../types/SerializedNode';
import { DataStoryContext } from './DataStoryContext';
import Diagram from './Diagram';
import { Link } from './Link';
import NodeFactory from './NodeFactory';
import { Port } from './Port';

export class DiagramFactory {
  context: DataStoryContext;

  static withContext(context: DataStoryContext) {
    return new this(context);
  }

  constructor(context: DataStoryContext = {}) {
    this.context = context;
  }

  hydrate(data: SerializedDiagram): Diagram {
    // Create empty diagram
    const diagram = new Diagram(this.context);

    // Add Nodes
    diagram.nodes = Object.values(data.nodes)
			.map((node: SerializedNode) => {
      	return new NodeFactory().hydrate(node, diagram);
    	});

    // Add Links
    diagram.links = Object.values(data.links)
			.map((data: any) => {
      	return new Link({
        	id: data.id,
        	sourcePort: diagram.find(data.sourcePort) as Port,
        	targetPort: diagram.find(data.targetPort) as Port,
      	});
    	});

    return diagram;
  }
}
