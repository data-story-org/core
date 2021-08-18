import { Node } from '../Node';
import { NodeParameter } from '../../NodeParameter';
import { Feature } from '../../Feature';

export class CreateCSV extends Node {
  constructor(options = {}) {
    super({
      // Defaults
      name: 'CreateCSV',
      summary: 'Create features from CSV content',
      category: 'Workflow',
      defaultInPorts: [],
      defaultOutPorts: ['Output'],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    const delimiter = this.getParameterValue('delimiter');
    const content = this.getParameterValue('content');
    const rows = content
      .split('\n')
      .map((row) => row.split(delimiter));
    const headings = rows.shift();

    const objects = rows.map((row) => {
      const object = {};
      for (const index in headings) {
        const key = headings[index];
        object[key] = this.parseValue(row[index]);
      }

      return object;
    });

    this.output(objects.map((o) => new Feature(o)));
  }

  serialize() {
    const description = super.serialize();

    description.parameters.push(
      NodeParameter.string('delimiter')
        .withValue('	')
        .withDescription('Default is TAB'),
      NodeParameter.textarea('content'),
    );

    return description;
  }

  protected parseValue(value: string) {
    // Its just some string
    if (isNaN(value as any)) return value;
    // Its numeric
    if (!Number.isNaN(parseFloat(value)))
      return parseFloat(value);
    if (!Number.isNaN(parseInt(value)))
      return parseInt(value);

    // Fallback
    return value;
  }
}
