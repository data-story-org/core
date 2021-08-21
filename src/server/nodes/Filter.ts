import { Node } from '../Node';
import { NodeParameter } from '../../NodeParameter';

export class Filter extends Node {
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
    const toMatchAgainst = this.getParameterValue(
      'attribute to match against',
    ).split('.');
    const ports = this.getParameterValue('Output ports');

    const isPortsConfigured = !(
      ports.length === 1 && ports[0] === 'port'
    );

    const isAttributePrimitive =
      toMatchAgainst.length === 1 &&
      (toMatchAgainst[0] === '' ||
        toMatchAgainst[0] === 'attribute to match' ||
        toMatchAgainst[0] === 'none');

    const isMatchAgainst = (port) => (feature) => {
      const { original } = feature;

      if (isAttributePrimitive) {
        return original == port;
      }

      if (toMatchAgainst.length > 1) {
        const data = toMatchAgainst.reduce((obj, path) => {
          return obj && obj[path] === undefined
            ? {}
            : obj[path];
        }, original);

        return String(data) == port;
      }

      return toMatchAgainst[0] in original
        ? String(original[toMatchAgainst[0]]) == port
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

      if (isAttributePrimitive) {
        return !ports.includes(original);
      }

      if (toMatchAgainst.length > 1) {
        const data = toMatchAgainst.reduce((obj, path) => {
          return obj && obj[path] === undefined
            ? {}
            : obj[path];
        }, original);

        return !(data !== undefined
          ? ports.includes(String(data))
          : false);
      }

      return typeof original === 'object' &&
        toMatchAgainst[0] in original
        ? !ports.includes(
            String(original[toMatchAgainst[0]]),
          )
        : true;
    });

    this.output(unmatched, 'Unfiltered');
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute to match against')
        .withValue('attribute to match')
        .withDescription(
          'you may use dot notated paths, or none to match feature generally',
        ),
      NodeParameter.port('Output ports', 'String_')
        .withValue('port')
        .withPlaceholder('port')
        .repeatable(),
    ];
  }
}
