import { OutputProvider } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it.skip('can provide outputs', async () => {
  await when(OutputProvider)
    .hasParameters({
      ok: [1],
      rejected: [2, 3],
    })
    .assertOutputs({
      ok: [1],
      rejected: [2, 3],
    })
    .finish();
});
