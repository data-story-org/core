import { Filter } from '../../../../src/server/nodes';
import { when } from '../NodeTester';
import { generateRandomString } from '../../../helpers';
import sample from 'lodash/sample';

describe('Filter node', () => {
  it('Filters based on given attribute and output ports', async () => {
    await when(Filter)
      .hasInput([
        { status: 'for-sale' },
        { status: 'upcoming' },
        { status: 'sold' },
      ])
      .and()
      .parameters({
        'attribute to match against': 'status',
        'Output ports': ['upcoming', 'sold'],
      })
      .and()
      .dynamicPorts(['upcoming', 'sold'])
      .assertOutputs({
        Unfiltered: [{ status: 'for-sale' }],
        upcoming: [{ status: 'upcoming' }],
        sold: [{ status: 'sold' }],
      })
      // .assertOutput([{ status: 'for-sale' }], 'Unfiltered')
      .finish();
  });

  it('Filters with random arguments', async () => {
    const randomValue1 = generateRandomString();
    const randomValue2 = generateRandomString();
    const needed = generateRandomString();

    await when(Filter)
      .hasInput([
        { attrToMatch: randomValue1 },
        { attrToMatch: needed },
        { attrToMatch: randomValue2 },
      ])
      .and()
      .parameters({
        'attribute to match against': 'attrToMatch',
        'Output ports': [needed],
      })
      .and()
      .dynamicPorts([needed])
      .and()
      .assertOutputs({
        Unfiltered: [
          { attrToMatch: randomValue1 },
          { attrToMatch: randomValue2 },
        ],
        [needed]: [{ attrToMatch: needed }],
      })
      .finish();
  });

  it('Filters with dot notated paths', async () => {
    const randomValue1 = generateRandomString();
    const randomValue2 = generateRandomString();
    const needed = generateRandomString();

    await when(Filter)
      .hasInput([
        { something: { attrToMatch: randomValue1 } },
        { something: { attrToMatch: needed } },
        { something: { attrToMatch: randomValue2 } },
      ])
      .and()
      .parameters({
        'attribute to match against':
          'something.attrToMatch',
        'Output ports': [needed],
      })
      .and()
      .dynamicPorts([needed])
      .and()
      .assertOutputs({
        Unfiltered: [
          { something: { attrToMatch: randomValue1 } },
          { something: { attrToMatch: randomValue2 } },
        ],
        [needed]: [{ something: { attrToMatch: needed } }],
      })
      .finish();
  });

  it('Filters with simple features', async () => {
    const randomValue1 = generateRandomString();
    const randomValue2 = generateRandomString();
    const needed = generateRandomString();

    await when(Filter)
      .hasInput([randomValue1, needed, randomValue2])
      .and()
      .parameters({
        'attribute to match against': sample([
          'none',
          '',
          'attribute to match',
        ]),
        'Output ports': [needed],
      })
      .and()
      .dynamicPorts([needed])
      .and()
      .assertOutputs({
        Unfiltered: [randomValue1, randomValue2],
        [needed]: [needed],
      })
      .finish();
  });
});
