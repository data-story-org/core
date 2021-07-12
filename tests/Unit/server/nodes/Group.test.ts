import Group from '../../../../src/server/nodes/Group';
import { when } from '../NodeTester';

it('can group features', async () => {
  await when(Group).hasInput([1, 2, 3]).assertOutputCount(1).finish();
});
