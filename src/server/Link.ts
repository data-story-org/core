import { SerializedLink } from '../types/SerializedLink';
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
    this.id = options.id ?? UID();
    this.sourcePort = options.sourcePort;
    this.targetPort = options.targetPort;
  }

  serialize(): SerializedLink {
    return {
      id: this.id,
      sourcePort: this.sourcePort.id,
      targetPort: this.targetPort.id,
    };
  }
}
