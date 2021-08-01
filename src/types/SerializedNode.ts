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
  parameters: {
    fieldType: string;
    value: string;
    name: string;
  }[];
  summary: string; // what?
  nodeType: string;
};

// TO BE MOVED TO GUI
export type SerializedReactNode = {
  id: string;
  type: string;
  x: number;
  y: number;
  ports: unknown[]; //SerializedPort
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
  selected: unknown;
  extras: unknown;
  locked: unknown;
};
