import RemoveAttributes from '../../../../src/server/nodes/RemoveAttributes';
import { when } from '../NodeTester';
import { generateRandomString } from '../../../helpers';

describe('RemoveAttributes node', () => {
  it('removes attributes from given input', async () => {
    await when(RemoveAttributes)
      .hasInput([
        { resource: 'todo' },
        { os: 'linux' },
        { browser: 'firefox' },
        { shell: 'zsh' },
      ])
      .and()
      .parameters({
        'attributes to remove': 'resource,os',
      })
      .assertOutput([
        { browser: 'firefox' },
        { shell: 'zsh' },
      ])
      .finish();
  });

  it('removes randomly genereated attributes', async () => {
    const attribute1 = generateRandomString();
    const attribute2 = generateRandomString();
    const wantedFeature = {
      wantedText: 'Really important one',
    };

    await when(RemoveAttributes)
      .hasInput([
        { [attribute1]: generateRandomString() },
        { [attribute2]: generateRandomString() },
        wantedFeature,
      ])
      .and()
      .parameters({
        'attributes to remove': `${attribute1},${attribute2}`,
      })
      .assertOutput([wantedFeature])
      .finish();
  });
});
