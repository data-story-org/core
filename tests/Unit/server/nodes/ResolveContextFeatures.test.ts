import ResolveContextFeatures from '../../../../src/server/nodes/ResolveContextFeatures';
import { when } from '../NodeTester';

it('can resolve values from context', async () => {
  await when(ResolveContextFeatures)
    .hasParameters({
      path_to_features: 'phones',
    })
    .and()
    .diagramHasContext({
      phones: [
        { product: 'iphone', price: 199 },
        { product: 'samsung', price: 119 },
        { product: 'nokia', price: 15 },
      ],
    })
    .assertOutput([
      { product: 'iphone', price: 199 },
      { product: 'samsung', price: 119 },
      { product: 'nokia', price: 15 },
    ])
    .finish();
});

it('can resolve from a nested context', async () => {
  await when(ResolveContextFeatures)
    .hasParameters({
      path_to_features: 'a.b.c',
    })
    .and()
    .diagramHasContext({
      a: { b: { c: [1, 2, 3] } },
    })
    .assertOutput([1, 2, 3])
    .finish();
});
