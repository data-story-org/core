import { Sleep } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it.skip('can run', async () => {
  await when(Sleep)
    .hasParameters({ seconds_to_sleep: 0 })
    .assertCanRun()
    .finish();
});
