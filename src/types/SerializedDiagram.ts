import { SerializedLink } from './SerializedLink';
import { SerializedNode } from './SerializedNode';

export interface SerializedDiagram {
  links: SerializedLink[];
  nodes: SerializedNode[];
  version: string;
}
