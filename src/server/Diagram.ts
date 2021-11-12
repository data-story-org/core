import { SerializedDiagram } from '../types/SerializedDiagram';
import version from '../utils/version';
import { DataStoryContext } from './DataStoryContext';
import { Link } from './Link';
import { Node } from './Node';
import { Port } from './Port';
import { DownloaderNode } from './DownloaderNode';
import { Input, Output } from './nodes';
import { Feature } from '../Feature';

export interface DiagramRunResult {
  diagram: Diagram;
}

export type RunResult = Promise<DiagramRunResult>;

export const diagramRunResult = (
  diagram: Diagram,
): RunResult =>
  new Promise<DiagramRunResult>((callback) =>
    callback({ diagram: diagram }),
  );

export class Diagram {
  links: Link[] = [];
  nodes: Node[] = [];
  cachedNodeDependencyMap: { [T: string]: string[] } = {
    // id1: [d1, d2, ...]
  };
  history: Node[] = [];
  context: DataStoryContext = {};

  constructor(context?: DataStoryContext) {
    this.context = context ?? {};
  }

  getContext(): DataStoryContext {
    return this.context;
  }

  setContext(context: DataStoryContext) {
    this.context = context;
  }

  populateInputs(inputMap = {}): void {
    Object.keys(inputMap).forEach((name) => {
      const inputNode: Node = this.findNodeByName(name);
      inputNode.features = inputMap[name];
    });
  }

  async run(inputMap = {}): Promise<DiagramRunResult> {
    this.populateInputs(inputMap);

    for await (const node of this.executionOrder()) {
      await node.run();
      if (node instanceof DownloaderNode) {
        await node.downloadData.download();
      }
    }

    return new Promise((callback) => {
      return callback({
        diagram: this,
      });
    });
  }

  findPort(id: string): Port {
    const ports = this.nodes
      .map((node) => node.ports)
      .flat();

    return ports.find((port) => port.id == id);
  }

  findNode(id: string): Node {
    return this.nodes.find((node) => node.id == id);
  }

  findPortByName(name: string): Port {
    const ports = this.nodes
      .map((node) => node.ports)
      .flat();
    return ports.find((port) => port.name == name);
  }

  findNodeByName(name: string): Node {
    return this.nodes.find(
      (node) => node.getParameterValue('node_name') == name,
    );
  }

  addNode(node) {
    node.diagram = this;
    this.history.push(node);
    this.nodes.push(node);
    this.linkToLatest(node);

    return this;
  }

  addLink(sourcePort, targetPort) {
    this.links.push(new Link({ sourcePort, targetPort }));

    return this;
  }

  linkToLatest(node) {
    // Try to link to latest nodes
    [...this.history].reverse().find((latest) => {
      if (this.canLink(latest, node)) {
        // fromPort: prefer first unused outPort. Otherwise defaults to first
        const sourcePort =
          this.getAutomatedFromPort(latest);

        // toPort: the first inPort
        const targetPort: any = Object.values(
          node.getInPorts(),
        )[0];
        this.links.push(
          new Link({ sourcePort, targetPort }),
        );

        return true; // exit find
      }
    });
  }

  getInputNodes(): Node[] {
    return this.nodes.filter((n) => n instanceof Input);
  }

  getOutputNodes(): Node[] {
    return this.nodes.filter((n) => n instanceof Output);
  }

  getOutputFeatures(name = 'Output'): Feature[] {
    const outputtingNode = this.getOutputNodes().find(
      (n) => {
        return name == n.getParameterValue('node_name');
      },
    );

    return outputtingNode.features;
  }

  getOutput(name = 'Output'): unknown[] {
    return this.getOutputFeatures(name).map(
      (f) => f.original ?? f,
    );
  }

  getAutomatedFromPort(fromNode): Port {
    const firstUnused: Node = fromNode
      .getOutPorts()
      .find((port) => port.hasZeroLinks);
    const first = fromNode.getOutPorts()[0];

    return firstUnused ?? first;
  }

  canLink(from, to) {
    // Still exists?
    if (!this.hasNode(from) || !this.hasNode(to)) return;

    // ensure not linking to itself
    if (from == to) return;

    // Has from node?
    if (!from) return;

    // Resolve ports
    const fromPort =
      Object.values(from.getOutPorts())[0] ?? false;
    const toPort =
      Object.values(to.getInPorts())[0] ?? false;

    // Ensure there are ports to connect to
    return fromPort && toPort;
  }

  executionOrder() {
    this.clearCachedNodeDependencies();

    const r = this.nodes.sort((n1, n2) => {
      if (this.dependsOn(n2, n1)) {
        return -1;
      }

      if (this.dependsOn(n1, n2)) {
        return 1;
      }

      return 0;
    });

    return r;
  }

  getCachedNodeDependencies(id) {
    return this.cachedNodeDependencyMap[id] ?? null;
  }

  setCachedNodeDependencies(id, dependencies) {
    this.cachedNodeDependencyMap[id] = dependencies;
  }

  clearCachedNodeDependencies() {
    this.cachedNodeDependencyMap = {};
  }

  dependencies(node) {
    const cached = this.getCachedNodeDependencies(node.id);
    if (cached !== null) {
      return cached;
    }

    const inPorts = Object.values(
      node.ports.filter((p) => p.in == true),
    );

    const linkLists = inPorts.map((port: any) =>
      port.getLinks(),
    );

    const links = linkLists
      .map((linkList) => Object.values(linkList))
      .flat();

    const dependencies = links.map((link: any) => {
      const sourcePort = link.sourcePort;
      const sourceNode = this.findPort(sourcePort.id).node;
      return this.findNode(sourceNode.id);
    });

    const deepDependencies = dependencies.map((d) => {
      return this.dependencies(d);
    });

    const result = dependencies.concat(
      deepDependencies.flat(),
    );

    this.setCachedNodeDependencies(node.id, result);

    return result;
  }

  dependsOn(n1, n2) {
    return this.dependencies(n1)
      .map((d) => {
        return d.id;
      })
      .includes(n2.id);
  }

  attemptLinkToLatest(node) {
    let linked = false;

    // Try to link to latest nodes
    this.history.find((latest) => {
      if (this.hasNode(latest)) {
        if (this.canLink(latest, node)) {
          const link = this.getAutomatedLink(latest, node);
          // break out of find with a return true
          return (linked = true);
        }
      }
    });
  }

  getAutomatedLink(from, to) {
    if (!this.canLink(from, to)) return;

    // fromPort: prefer first unused outPort. Otherwise defaults to first
    const sourcePort: any = this.getAutomatedFromPort(from);

    // toPort: the first inPort
    const targetPort: any = Object.values(
      to.getInPorts(),
    )[0];

    const link = new Link({ sourcePort, targetPort });

    return link;
  }

  hasNode(node) {
    return Boolean(node.id && this.findNode(node.id));
  }

  serialize(): SerializedDiagram {
    return {
      links: this.links.map((link) => link.serialize()),
      nodes: this.nodes.map((node) => node.serialize()),
      version,
    };
  }
}
