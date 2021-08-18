import { ThrowError } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it.skip('will throw an error', async () => {
  await when(ThrowError)
    .hasInput(['a feature'])
    .assertCantRun()
    .finish();
});
