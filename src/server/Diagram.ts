import { SerializedDiagram } from '../types/SerializedDiagram';
import version from '../utils/version';
import { DataStoryContext } from './DataStoryContext';
import { Link } from './Link';
import { Node } from './Node';
import { Port } from './Port';
import { isBrowser, isNode } from 'browser-or-node';
import { DownloaderNode } from './DownloaderNode';
import { Output } from './nodes';
import { Feature } from '../Feature';

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

  async run() {
    for await (const node of this.executionOrder()) {
      await node.run();
      if (
        node instanceof DownloaderNode &&
        !isNode &&
        isBrowser
      ) {
        await node.downloadData.download();
      }
    }

    return new Promise((callback) => {
      return callback({
        data: {
          diagram: this,
        },
      });
    });
  }

  find(id: string): Node | Link | Port {
    const searchables = this.nodes
      .concat(
        this.nodes
          .map((node) => node.ports)
          .flat() as any[],
      )
      .concat(this.links as any[]);

    return searchables.find((entity) => entity.id == id);
  }

  findByName(name: string): Node | Link | Port {
    const searchables = this.nodes
      .concat(
        this.nodes.map((node) => node.ports).flat() as any,
      )
      .concat(this.links as any);

    return searchables.find(
      (entity) => entity.name == name,
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
    this.history.find((latest) => {
      if (this.hasNode(latest)) {
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
      }
    });
  }

	getOutputFeatures(name = 'Output'): Feature[] {
		const outputtingNode = this.nodes.find(n => {
			return n instanceof Output && name == n.getParameterValue('node_name')
		})

		return outputtingNode.features
	}
	
	getOutput(name = 'Output'): unknown[] {
		return this.getOutputFeatures(name).map(f => f.original)
	}	

  getAutomatedFromPort(fromNode): Port {
    const firstUnused: Node = fromNode
      .getOutPorts()
      .find((port) => port.hasZeroLinks);
    const first = fromNode.getOutPorts()[0];

    return firstUnused ?? first;
  }

  canLink(from, to) {
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
      const sourceNode = (this.find(sourcePort.id) as Port)
        .node;
      return this.find(sourceNode.id);
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
    return Boolean(node.id && this.find(node.id));
  }

  serialize(): SerializedDiagram {
    return {
      links: this.links.map((link) => link.serialize()),
      nodes: this.nodes.map((node) => node.serialize()),
      version,
    };
  }
}
