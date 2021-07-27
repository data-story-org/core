import { SerializedPort } from './SerializedPort';

export type SerializedNode = {
  id: string;
  type: string;
  x: number;
  y: number;
  ports: any[]; //SerializedPort
  category: string;
  editableInPorts: boolean;
  editableOutPorts: boolean;
  key?: string; // what?
  name: string;
  nodeReact: string; // what?
  parameters: {
    fieldType: string;
    value: string;
    name: string;
  }[];
  summary: string; // what?
  nodeType: string;
  selected: any;
  extras: any;
  locked: any;
};
