import { Inspect } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it('has attached features', async () => {
  await when(Inspect)
    .hasInput([1, 2, 3])
    .assertAttachedFeatures([1, 2, 3])
    .finish();
});
