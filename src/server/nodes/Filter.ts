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
      this.getParameterValue('attribute');
    const ports = this.getParameterValue('Output ports');

    const isMatchAgainst = (port) => (feature) => {
      const { original } = feature;

      return toMatchAgainst in original
        ? original[toMatchAgainst] === port
        : false;
    };

    ports.forEach((p) => {
      const allMatched = this.input().filter((feature) =>
        isMatchAgainst(p)(feature),
      );

      this.output(allMatched, p);
    });

    const unmatched = this.input().filter((feature) => {
      const { original } = feature;

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
        .withValue('name')
        .withDescription('attribute to match against'),
      NodeParameter.port('Output ports', 'String_')
        .withValue('port')
        .repeatable(),
    ];
  }
}
