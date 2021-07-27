import { Feature } from '../Feature';
import { UID } from '../utils';
import { Node } from './Node';

export class Port {
  name: string;
  features: Feature[];
  in: boolean;
  links: any[] = [];
  id: string;
  node: Node;

  constructor(options: {
    name: string;
    in: boolean;
    id?: string;
    node?: Node;
  }) {
    this.name = options.name;
    this.in = options.in;
    this.id = options.id ?? UID();
    this.node = options.node ?? null;
  }

  getLinks() {
    return this.node.diagram.links.filter((link) => {
      return (
        link.sourcePort.id == this.id ||
        link.targetPort.id == this.id
      );
    });
  }

  hasZeroLinks(): boolean {
    return this.getLinks().length == 0;
  }

	serialize() {
		return {
			id: this.id,
			name: this.name,
			in: this.in,
		}
	}
}
