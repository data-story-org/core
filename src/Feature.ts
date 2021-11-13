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

  public parse(template: string): string {
    /* eslint-disable no-useless-escape */
    const matches = template.match(
      /\{\{[\.a-zA-Z\s_]*\}\}/g,
    );

		if(!matches) return template;

		let parsed = template;

		for (const match of matches) {
			const originalMatch = match;

			const parts = match
				.replace('{{', '')
				.replace('}}', '')
				.trim()
				.split('.');

			parts.shift(); // Remove 'feature'

			const interpreted: any = parts.reduce(
				(carry, property) => {
					return carry[property];
				},
				this.original,
			);

			parsed = parsed.replace(
				originalMatch,
				interpreted,
			);
		}

		return parsed;
  }

  public type() {
    return typeof this.original;
  }
}
