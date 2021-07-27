import Diagram from './Diagram';
import _ from 'lodash';
import { Feature } from '../Feature';
import { UID } from '../utils';
import NodeParameter from '../NodeParameter';
import { Port } from './Port';
import { Link } from './Link';

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
  id?: string;
};

export abstract class Node {
  public id: string;
  public ports: Port[];
  public diagram: Diagram;
  public category = 'Custom';
  public editableInPorts = false;
  public editableOutPorts = false;
  public key = 'test-key';
  public name: string;
  public nodeType: string;
  public nodeReact = 'Node';
  public parameters: any[];
  public summary = 'No summary provided.';
  public defaultInPorts: string[];
  public defaultOutPorts: string[];

  abstract run(): any;

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

    this.ports = this.createPorts(options);
  }

  createPorts(options) {
    if (!options.ports) {
      return [
        ...this.getDefaultInPorts(),
        ...this.getDefaultOutPorts(),
      ];
    }

    const ports = Object.values(options.ports);

    return ports.map((port: any) => {
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
      category: this.category,
      editableInPorts: this.editableInPorts,
      editableOutPorts: this.editableOutPorts,
      ports: this.ports,
      key: this.key,
      name: this.name,
      nodeReact: this.nodeReact,
      nodeType: this.nodeType ?? this.name,
      parameters: this.parameters.length
        ? this.parameters
        : this.getDefaultParameters(),
      summary: this.summary,
    };
  }

  getDefaultParameters() {
    return [
      NodeParameter.string('node_name').withValue(
        this.name,
      ),
    ];
  }

  protected getParameter(name: string) {
    return this.parameters.find((p) => p.name == name);
  }

  protected getParameterValue(
    name: string,
    feature: Feature = null,
  ): string {
    const value = this.getParameter(name).value;

    if (!feature) return value;

    return this.interpretParameterValue(value, feature);
  }

  public setParameterValue(name, value) {
    const found = this.parameters.find(
      (p) => p.name == name,
    );
    found.value = value;
  }

  protected interpretParameterValue(parametric, feature) {
    /* eslint-disable no-useless-escape */
    const matches = parametric.match(
      /\{\{[\.a-zA-Z\s_]*\}\}/g,
    );
    if (matches) {
      for (const match of matches) {
        const originalMatch = match;

        const parts = match
          .replace('{{', '')
          .replace('}}', '')
          .trim()
          .split('.');

        parts.shift(); // Remove 'feature'

        const interpreted = parts.reduce(
          (carry, property) => {
            return carry[property];
          },
          feature.original,
        );

        parametric = parametric.replace(
          originalMatch,
          interpreted,
        );
      }
    }

    return parametric;
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

    return _.cloneDeep(features);
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
