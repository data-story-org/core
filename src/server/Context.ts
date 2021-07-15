// the user is free to use any keys
export class Context {
	constructor(data: object) {
		for (const [key, value] of Object.entries(data)) {
			this[key] = value;
		}		
	}
}
