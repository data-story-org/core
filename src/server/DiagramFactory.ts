import { SerializedDiagram } from '../types/SerializedDiagram';
import { SerializedLink } from '../types/SerializedLink';
import { SerializedNode } from '../types/SerializedNode';
import { DataStoryContext } from './DataStoryContext';
import { Diagram } from './Diagram';
import { Link } from './Link';
import { NodeFactory } from './NodeFactory';
import { Port } from './Port';

export class DiagramFactory {
  context: DataStoryContext;

  static withContext(
    context: DataStoryContext,
  ): DiagramFactory {
    return new this(context);
  }

  constructor(context: DataStoryContext = {}) {
    this.context = context;
  }

  hydrate(data: SerializedDiagram): Diagram {
    // Create empty diagram
    const diagram = new Diagram(this.context);

    // Add Nodes
    diagram.nodes = Object.values(data.nodes).map(
      (node: SerializedNode) => {
        return new NodeFactory().hydrate(node, diagram);
      },
    );

    // Add Links
    diagram.links = Object.values(data.links).map(
      (data: SerializedLink) => {
        return new Link({
          id: data.id,
          sourcePort: diagram.findPort(data.sourcePort),
          targetPort: diagram.findPort(data.targetPort),
        });
      },
    );

    return diagram;
  }
}
