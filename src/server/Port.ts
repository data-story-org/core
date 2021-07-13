import { Feature } from '../Feature';
import UID from '../utils/UID';
import Node from './Node';

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
    links?: [];
	id?: string;
	node?: Node;
  }) {
    this.name = options.name;
    this.in = options.in;
    this.links = options.links ?? [];
	this.id = options.id ?? UID()
	this.node = options.node ?? null
  }

  getLinks() {
	return this.node.diagram.links.filter(link => {
		return link.from.id == this.id || link.to.id == this.id
	})
  }
}
