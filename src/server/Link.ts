import UID from '../utils/UID';

export class Link {
  id: string;

  constructor(options: {
    id?: string;
  }) {
    this.id = options.id ?? UID();
  }
}
