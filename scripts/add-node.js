fs = require('fs');

const nodeName = process.argv[2];

// Create Node file
fs.writeFile(
  __dirname + '/../src/server/nodes/' + nodeName + '.ts',
  fs
    .readFileSync(__dirname + '/add-node.stub')
    .toString()
    .replace(/NODE_NAME/g, nodeName),
  {},
  () => {},
);

// Add Node file to nodes index
const nodesIndex =
  __dirname + '/../src/server/nodes/index.ts';
let lines = fs
  .readFileSync(nodesIndex, 'utf8')
  .split(/\r?\n/);
lines.push(`export * from './${nodeName}';`);
fs.writeFile(
  nodesIndex,
  lines.sort().join('\n'),
  function (err) {
    if (err) throw err;
  },
);

// Create Test file
fs.writeFile(
  __dirname +
    '/../tests/Unit/server/nodes/' +
    nodeName +
    '.test.ts',
  fs
    .readFileSync(__dirname + '/add-node-test.stub')
    .toString()
    .replace(/NODE_NAME/g, nodeName),
  {},
  () => {},
);

console.info(nodeName + ' NodeFile and test created!');
