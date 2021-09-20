import { Diagram } from './Diagram';

export type Tag = string;

export class DataStory {
  constructor(
    public name: string,
    public description: string,
    public tags: Tag[],
    public diagram: Diagram,
  ) {}
}
