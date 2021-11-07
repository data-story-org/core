import { Diagram, RunResult } from './Diagram';
import cloneDeep from 'lodash/cloneDeep';
import { Feature } from '../Feature';
import { UID } from '../utils';
import { NodeParameter } from './NodeParameter';
import { Port } from './Port';
import { SerializedPort } from '../types';

type NodeOptions = {
  diagram?: Diagram;
  parameters?: object[];
  defaultInPorts?: string[];
  defaultOutPorts?: string[];
  editableInPorts?: boolean;
  editableOutPorts?: boolean;
  name?: string;
  nodeType?: string;
  summary?: string;
  category?: string;
  ports?: SerializedPort[];
  id?: string;
  features?: Feature[];
};

export type NodeClass = {
  new (options?: NodeOptions): Node;
};

export abstract class Node {
  public id: string;
  public ports: Port[];
  public diagram: Diagram;
  public category = 'Custom';
  public editableInPorts = false;
  public editableOutPorts = false;
  public name: string;
  public nodeType: string;
  public nodeReact = 'Node';
  public parameters: any[];
  public summary = 'No summary provided.';
  public defaultInPorts: string[];
  public defaultOutPorts: string[];
  public features: any[];

  abstract run(): RunResult;

  constructor(options: NodeOptions = {}) {
    this.diagram = options.diagram;
    this.id = options.id ?? UID();
    this.name = options.name;
    this.nodeType = options.nodeType ?? this.name;
    this.summary = options.summary;
    this.category = options.category;
    (this.defaultInPorts = options.defaultInPorts ?? [
      'Input',
    ]),
      (this.defaultOutPorts = options.defaultOutPorts ?? [
        'Output',
      ]),
      (this.editableInPorts =
        options.editableInPorts ?? false);
    this.editableOutPorts =
      options.editableOutPorts ?? false;
    this.parameters = options.parameters
      ? options.parameters
      : [];

    this.ports = this.createPorts(options.ports);
    this.features = options.features ?? [];
  }

  addDynamicPorts(dynamicPorts) {
    this.ports = this.createPorts([
      ...this.ports,
      ...dynamicPorts.map((name) => {
        return new Port({
          name,
          in: false,
          node: this,
        });
      }),
    ]);
  }

  createPorts(ports) {
    if (!ports) {
      return [
        ...this.getDefaultInPorts(),
        ...this.getDefaultOutPorts(),
      ];
    }

    return Object.values(ports).map((port: any) => {
      port =
        port instanceof Port
          ? port
          : new Port({
              id: port.id ?? null,
              name: port.name,
              in: port.in,
            });

      port.node = this;
      return port;
    });
  }

  getDefaultInPorts() {
    return this.defaultInPorts.map((name) => {
      return new Port({
        name,
        in: true,
        node: this,
      });
    });
  }

  getDefaultOutPorts() {
    return this.defaultOutPorts.map((name) => {
      return new Port({
        name,
        in: false,
        node: this,
      });
    });
  }

  getInPorts() {
    return this.ports.filter((p) => p.in);
  }

  getOutPorts(): Port[] {
    return this.ports.filter((p) => !p.in);
  }

  serialize() {
    return {
      id: this.id,
      category: this.category,
      editableInPorts: this.editableInPorts,
      editableOutPorts: this.editableOutPorts,
      ports: this.ports.map((port) => port.serialize()),
      name: this.name,
      nodeReact: this.nodeReact,
      nodeType: this.nodeType ?? this.name,
      parameters: this.parameters.length
        ? this.parameters
        : this.getDefaultParameters(),
      summary: this.summary,
      features: this.features,
    };
  }

  getDefaultParameters() {
    return [
      NodeParameter.string('node_name').withValue(
        this.name,
      ),
    ];
  }

  getParameter(name: string): NodeParameter {
    return this.parameters.find((p) => p.name == name);
  }

  getParameterValue(name: string): any {
    return this.getParameter(name).value;
  }

  public setParameterValue(name, value) {
    const found = this.parameters.find(
      (p) => p.name == name,
    );
    found.value = value;
  }

  protected input(portName = 'Input') {
    return this.getDataAtPortNamed(portName);
  }

  protected getDataAtPortNamed(name = 'Input') {
    const port = this.portNamed(name);
    const features = port
      .getLinks()
      .map((link) => {
        return link.sourcePort.features ?? [];
      })
      .flat();

    return cloneDeep(features);
  }

  protected output(features: any[], port = 'Output') {
    this.portNamed(port).features = this.portNamed(port)
      .features
      ? this.portNamed(port).features.concat(features)
      : features;
  }

  protected portNamed(name: string) {
    return this.ports.find((port) => port.name == name);
  }
}
