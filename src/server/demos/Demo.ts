import { Diagram } from '../Diagram';

export class Demo {
  constructor(
    public name: string,
    public description: string,
    public tags: string[],
    public diagram: Diagram,
  ) {}
}
