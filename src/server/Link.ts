import { UID } from '../utils';
import { Port } from './Port';

export class Link {
  id: string;
  sourcePort: Port;
  targetPort: Port;

  constructor(options: {
    id?: string;
    sourcePort: Port;
    targetPort: Port;
  }) {
    this.id = options.id ?? 'bajs'; //UID();
    this.sourcePort = options.sourcePort;
    this.targetPort = options.targetPort;
  }
}
