import RenameAttributes from '../../../../src/server/nodes/RenameAttributes';
import { when } from '../NodeTester';
import { generateRandomString } from '../../../helpers';

describe('RenameAttributes node', () => {
  it('Renames attributes from given input', async () => {
    const id = generateRandomString();
    const city = generateRandomString();
    const resource = generateRandomString();

    await when(RenameAttributes)
      .hasInput([
        { globalID: id },
        { PSTLCITY: city },
        { resource: resource },
      ])
      .and()
      .parameters({
        'Attributes to rename': [
          {
            input: { value: 'globalID' },
            output: { value: 'GLOBALID' },
          },
          {
            input: { value: 'PSTLCITY' },
            output: { value: 'CITY' },
          },
          {
            input: { value: 'resource' },
            output: { value: 'RESOURCE' },
          },
        ],
      })
      .assertOutput([
        { GLOBALID: id },
        { CITY: city },
        { RESOURCE: resource },
      ])
      .finish();
  });
});
