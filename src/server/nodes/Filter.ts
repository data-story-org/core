import { Node } from '../Node';
import { NodeParameter } from '../../NodeParameter';

export default class Filter extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'Filter',
      summary: 'Filter nodes by attribute name',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Unfiltered'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const toMatchAgainst =
      this.getParameterValue('attribute').split('.');
    const ports = this.getParameterValue('Output ports');

    const isPortsConfigured = !(
      ports.length === 1 && ports[0] === 'port'
    );

    const isMatchAgainst = (port) => (feature) => {
      const { original } = feature;

      if (toMatchAgainst.length > 1) {
        const data = toMatchAgainst.reduce((obj, path) => {
          return obj && obj[path] === undefined
            ? {}
            : obj[path];
        }, original);

        return data === port;
      }

      return toMatchAgainst in original
        ? original[toMatchAgainst] === port
        : false;
    };

    if (isPortsConfigured) {
      ports.forEach((p) => {
        const allMatched = this.input().filter((feature) =>
          isMatchAgainst(p)(feature),
        );

        this.output(allMatched, p);
      });
    }

    const unmatched = this.input().filter((feature) => {
      const { original } = feature;

      if (toMatchAgainst.length > 1) {
        const data = toMatchAgainst.reduce((obj, path) => {
          return obj && obj[path] === undefined
            ? {}
            : obj[path];
        }, original);

        return !(data !== undefined
          ? ports.includes(data)
          : false);
      }

      return !(toMatchAgainst in original
        ? ports.includes(original[toMatchAgainst])
        : false);
    });

    this.output(unmatched, 'Unfiltered');
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute')
        .withValue('attribute to match against')
        .withDescription('you may use dot notated paths'),
      NodeParameter.port('Output ports', 'String_')
        .withValue('port')
        .repeatable(),
    ];
  }
}
