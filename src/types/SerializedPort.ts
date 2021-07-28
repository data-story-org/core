export type SerializedPort = {
	id: string,
	name: string,
	in: boolean,
};


export type SerializedReactPort = {
  id: string;
  type: string;
  x: number;
  y: number;
  name: string;
  alignment: string;
  parentNode: string;
  links: string[];
  in: boolean;
  label: string;
  features: any[];
};
