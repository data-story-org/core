import { get } from './utils/Obj';

export class Feature {
  constructor(public original: unknown = null) {}

  public get(property: string) {
    return get(this.original, property);
  }

  public set(...args: any[]) {
    if (args.length === 2) {
      this.original[args[0]] = args[1];
    }

    if (args.length === 1) {
      this.original = args[0];
    }

    return this;
  }

  public type() {
    return typeof this.original;
  }
}
