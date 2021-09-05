import { Multiply } from '../../../../src/server/nodes/Multiply';
import { when } from '../NodeTester';

describe('DownloadJSON node', () => {
  it('will multiply numbers with a default factor of 2', async () => {
    await when(Multiply)
      .hasInput([1, 2, 3])
      .assertOutput([2, 4, 6])
      .finish();
  });

  it('will multiply numbers with configurable factor', async () => {
    await when(Multiply)
      .hasInput([1, 2, 3])
      .and()
      .hasParameters({ factor: 3 })
      .assertOutput([3, 6, 9])
      .finish();
  });

  it('will yield NaN if recieving objects', async () => {
    await when(Multiply)
      .hasInput([{}])
      .assertOutput([NaN])
      .finish();
  });
});
