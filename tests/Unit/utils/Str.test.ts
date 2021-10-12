import { trim } from '../../../src/utils/Str';

test('it can trim', () => {
  expect(trim('/cool/', '/')).toStrictEqual('cool');
});
