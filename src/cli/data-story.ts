import Diagram from '../server/Diagram';
import { Node } from '../server/Node';
import NodeFactory from '../server/NodeFactory';
import { nonCircularJsonStringify } from '../utils/nonCircularJsonStringify';

const type = process.argv[2];
const args = process.argv.slice(3);

const boot = () => {
  const result = nonCircularJsonStringify({
    stories: [],
    availableNodes: NodeFactory.all().map((node) =>
      (new node() as Node).serialize(),
    ),
  });

  console.log(result);
};

const help = () => {
  console.log(
    'Please use syntax:\n\n    node data-story.js <ACTION> <DATA>\n\navailable actions [boot, help, run]',
  );
};

const run = async (serializedDiagram) => {
  const result = await Diagram.hydrate(
    JSON.parse(serializedDiagram),
    NodeFactory,
  ).run();
  console.log(
    nonCircularJsonStringify((result as any).data),
  );
};

const handlers = { boot, help, run };
const handler = handlers[type] ?? help;
handler(...args);
