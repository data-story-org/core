import { diagramRunResult } from '../Diagram';
import { Node } from '../Node';

export class Log extends Node {
  logger = console;

  constructor(options = {}) {
    super({
      // Defaults
      name: 'Log',
      summary: 'log inputs to console',
      category: 'Workflow',
      defaultInPorts: ['Input'],
      defaultOutPorts: [],
      // Explicitly configured
      ...options,
    });
  }

  async run() {
    // do like this to help when searching for console littering
    const method = 'log';

    this.logger.group('DataStory Log Node: ' + this.id);
    this.logger[method](
      this.input().map((f) => f.original),
    );
    console[method](
      JSON.stringify(this.input().map((f) => f.original)),
    );
    this.logger.groupEnd();

    return diagramRunResult(this.diagram);
  }
}
