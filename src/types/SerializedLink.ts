export type SerializedLink = {
  id: string;
  sourcePort: string;
  targetPort: string;
};

// TO BE MOVED
export type SerializedReactLink = {
  id: string;
  type: string;
  source: string;
  sourcePort: string;
  target: string;
  targetPort: string;
  points: {
    id: string;
    type: string;
    x: number;
    y: number;
  }[];
  labels: [];
  width: number;
  color: string;
  curvyness: number;
  selectedColor: string;
};
