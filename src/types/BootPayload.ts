import { SerializedDiagram } from './SerializedDiagram';

export interface BootPayload {
  data: {
    stories?: string[];
    availableNodes: object[];
    serializedModel?: SerializedDiagram;
  };
}
