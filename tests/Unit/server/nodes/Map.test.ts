import { Map } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it('can map into properties', async () => {
  await when(Map)
    .hasInput({ name: 'ajthinking' })
    .and()
    .parameters({ property: 'name' })
    .assertOutput('ajthinking')
    .finish();
});

it('can map into nested properties', async () => {
  await when(Map)
    .hasInput({ a: { b: 'c' } })
    .and()
    .parameters({ property: 'a.b' })
    .assertOutput('c')
    .finish();
});
