import Log from '../../../../src/server/nodes/Log';
import { when } from '../NodeTester';

it.skip('can run', async () => {
  await when(Log)
    .hasInput([1, 2, 3])
    .assertCanRun()
    .finish();
});
