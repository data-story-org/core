import Comment from '../../../../src/server/nodes/Comment';
import { when } from '../NodeTester';

test('that comments wont break', async () => {
  await when(Comment).hasDefaultParameters().assertCanRun().finish();
});
