import Inspect from '../../../../src/server/nodes/Inspect';
import { when } from '../NodeTester';

it('can run', async () => {
  await when(Inspect)
    .hasInput([1, 2, 3])
    .assertCanRun()
    .finish();
});
