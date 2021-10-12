import { NodeParameter } from '../NodeParameter';
import { SerializedPort } from './SerializedPort';

export type SerializedNode = {
  id: string;
  ports: SerializedPort[];
  category: string;
  editableInPorts: boolean;
  editableOutPorts: boolean;
  key?: string; // what?
  name: string;
  nodeReact: string; // what?
  parameters: NodeParameter[];
  summary: string; // what?
  nodeType: string;
};
