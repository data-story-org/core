import { Node } from '../Node';
import { trim } from '../../utils/Str';
import { NodeParameter } from '../NodeParameter';

export class RegExpFilter extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'RegExpFilter',
      summary:
        'Filter features matching an attribute regular expression',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: ['Passed', 'Failed'],
      // Explicitly configured
      ...options,
    });
  }

  getDefaultParameters() {
    return [
      ...super.getDefaultParameters(),
      NodeParameter.string('attribute').withValue(''),
      NodeParameter.string('expression').withValue(
        '/test|draft|dummy/',
      ),
    ];
  }

  async run() {
    this.output(this.matching(), 'Passed');
    this.output(this.notMatching(), 'Failed');
  }

  protected matching() {
    return this.filterByRegExp(this.input());
  }

  protected notMatching() {
    return this.filterByRegExp(this.input(), true);
  }

  protected filterByRegExp(features, returnFailed = false) {
    return features.filter((feature) => {
      const expression = this.getExpression();
      const attribute = this.getParameterValue('attribute');
      const comparable = attribute
        .split('.')
        .reduce((traversed, part) => {
          return part ? traversed[part] : traversed;
        }, feature.original);

      return returnFailed
        ? !expression.test(comparable)
        : expression.test(comparable);
    });
  }

  protected getExpression() {
    const cleaned = trim(
      this.getParameterValue('expression'),
      '/',
    );
    return RegExp(cleaned as string);
  }
}
