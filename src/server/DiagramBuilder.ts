import { DataStoryContext } from './DataStoryContext';
import Diagram from './Diagram';
import { Node } from './Node';

export class DiagramBuilder {
  currentNode?: Node;
  diagram?: Diagram;
  diagramContext: DataStoryContext;

  static begin() {
    return new this();
  }

  add(nodeClass, parameterKeyValues = {}, config = {}) {
    const diagram = this.getDiagram();

    const node = new nodeClass({
      ...new nodeClass().serialize(),
      ...config,
    });

    diagram.addNode(node);

    this.diagram = diagram;

    this.currentNode = node;

    return this.withParameters(parameterKeyValues);
  }

  setContext(context: DataStoryContext) {
    this.diagramContext = context;
    return this;
  }

  withParameters(parameters: object) {
    for (const [name, value] of Object.entries(
      parameters,
    )) {
      const parameter = this.currentNode.parameters.find(
        (p) => p.name == name,
      );
      parameter.value = value;
    }

    return this;
  }

  finish() {
    return this.getDiagram();
  }

  protected getDiagram() {
    return (
      this.diagram ??
      new Diagram(this.diagramContext ?? {})
    );
  }
}
