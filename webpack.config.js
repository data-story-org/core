const path = require('path');

module.exports = {
  target: 'node',
  entry: './lib/cli/data-story.js',
  output: {
    filename: 'cli-bundle.js',
    path: path.resolve(__dirname, 'lib/cli'),
  },
};