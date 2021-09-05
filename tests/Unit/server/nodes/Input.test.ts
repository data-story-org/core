import { Input } from '../../../../src/server/nodes/Input';
import { when } from '../NodeTester';

describe('Input node', () => {
  it('will default to an empty array', async () => {
    await when(Input)
      .hasDefaultParameters()
      .assertOutput([])
      .finish();
  });
});
