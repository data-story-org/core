import Server from '../server/Server'
import ServerDiagram from '../server/ServerDiagram';
import ServerNodeFactory from '../server/ServerNodeFactory';
import { nonCircularJsonStringify } from '../utils/nonCircularJsonStringify';

const type = process.argv[2];
const args = process.argv.slice(3)

const boot = () => {
	let result = JSON.stringify({
		stories: [],
		availableNodes: ServerNodeFactory.all().map(node => (new node()).serialize())
	})

	console.log(result)
}

const help = () => {
	console.log('Please use syntax:\n\n    node data-story.js <ACTION> <DATA>\n\navailable actions [boot, help, run]')
}

const run = async (serializedDiagram) => {
	let result = await ServerDiagram.hydrate(JSON.parse(serializedDiagram), ServerNodeFactory).run()
	console.log(nonCircularJsonStringify((result as any).data))
}

const handlers = {boot, help, run}
const handler = handlers[type] ?? help
handler(...args)