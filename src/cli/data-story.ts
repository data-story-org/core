import { DiagramFactory } from '../server/DiagramFactory';
import { Node } from '../server/Node';
import NodeFactory from '../server/NodeFactory';
import { nonCircularJsonStringify } from '../utils/nonCircularJsonStringify';

const type = process.argv[2];
const args = process.argv.slice(3);

const boot = (serializedContext = '{}') => {
	const context = JSON.parse(serializedContext)
	const factory = new NodeFactory(context)

  const result = nonCircularJsonStringify({
    stories: [],
    availableNodes: Object.values(factory.all()).map((node) =>
      (new node() as Node).serialize(),
    ),
  });

  console.log(result);
};

const help = () => {
  console.log(
    'Please use syntax:\n\n    node data-story.js <ACTION> <?CONTEXT>\n\navailable actions [boot, help, run]',
  );
};

const run = async (diagramJson, serializedContext = '{}') => {
	let diagram = (new DiagramFactory).hydrate(
    JSON.parse(diagramJson)
  )

	diagram.setContext(
		JSON.parse(serializedContext)
	)

  const result = await diagram.run();
	
	console.log(
    nonCircularJsonStringify((result as any).data.diagram.serialize()),
  );
};

const handlers = { boot, help, run };
const handler = handlers[type] ?? help;
handler(...args);
