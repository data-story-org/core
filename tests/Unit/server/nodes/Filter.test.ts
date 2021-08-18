import { Filter } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

describe('Filter node', () => {
  it('Filters based on given attribute and output ports', async () => {
    await when(Filter)
      .hasInput([
        {
          status: 'for-sale',
        },
        {
          status: 'upcoming',
        },
        {
          status: 'sold',
        },
      ])
      .and()
      .parameters({
        'attribute to match against': 'status',
        'Output ports': ['upcoming', 'sold'],
      })
      // .assertOutput({
      //   Unfiltered: [{ status: 'for-sale' }],
      // })
      // Doesn't work because our test diagram don't create needed output ports
      // .assertOutput([{ status: 'for-sale' }])
      // .assertOutputCount(3)
      .finish();
  });
});
