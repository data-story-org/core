import { SerializedDiagram } from '../types/SerializedDiagram';
import { SerializedNodeModel } from '../types/SerializedNodeModel';
import Diagram from './Diagram';
import { Link } from './Link';
import NodeFactory from './NodeFactory';
import { Port } from './Port';

export class DiagramFactory {
  static make() {
    return new Diagram();
  }

  static hydrate(payload: string | SerializedDiagram): Diagram {
    const data: SerializedDiagram =
      typeof payload == 'string'
        ? JSON.parse(payload)
        : payload;

    // Create empty diagram
    const instance = new Diagram();

    // Add Nodes
    instance.nodes = Object.values(
      data.layers[1].models,
    ).map((node: SerializedNodeModel) => {
      return NodeFactory.hydrate(node, instance);
    });

    // Add Links
    instance.links = Object.values(
      data.layers[0].models,
    ).map((data: any) => {
      return new Link({
        id: data.id,
        sourcePort: instance.find(data.sourcePort) as Port,
        targetPort: instance.find(data.targetPort) as Port,
      });
    });

    return instance;
  }
}
