const path = require('path');

module.exports = {
  target: 'node',
  entry: './lib/src/cli/data-story.js',
  mode: 'production',
  output: {
    filename: 'cli.js',
    path: path.resolve(__dirname, 'cli/'),
  },
};
