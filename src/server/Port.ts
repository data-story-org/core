import { Feature } from "../Feature";

export class Port {
	name: string
	features: Feature[]
	in: boolean
	links: any[] = []

	constructor(options: {
		name: string,
		in: boolean,
		links?: []
	}) {
		this.name = options.name
		this.in = options.in
		this.links = options.links ?? []
	}
}