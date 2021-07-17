# Data Story - Core

See also [data-story-org/gui](https://github.com/data-story-org/gui)

## Development

### Installation
```
yarn
# Build web files
tsc --watch
# Build CLI
npx webpack
```

### Tests
Run tests with
```
yarn test --watch
```
### Add node
You may run the following command
```
yarn add-node YourNodeName
```

This will create a new `Node` class along with a test stub. Then you need to manually register it in `NodeFactory`.
