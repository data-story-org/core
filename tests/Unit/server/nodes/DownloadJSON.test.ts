import { when } from '../NodeTester';
import { DownloadJSON } from '../../../../src/server/nodes';
import { generateRandomString } from '../../../helpers';

describe('DownloadJSON node', () => {
  global.URL.createObjectURL = jest.fn();

  it('Generates right data to download', async () => {
    const randomData1 = generateRandomString();
    const randomData2 = generateRandomString();

    await when(DownloadJSON)
      .hasInput([
        {
          value1: randomData1,
          value2: randomData2,
        },
      ])
      .and()
      .parameters({
        'attributes to download': [''],
        'pretty print json': 'false',
      })
      .assertDownloads([
        {
          value1: randomData1,
          value2: randomData2,
        },
      ])
      .finish();
  });

  it('Supports dot-notated paths', async () => {
    const randomData1 = generateRandomString();
    const randomData2 = generateRandomString();
    const randomData3 = generateRandomString();

    const feature = {
      value1: {
        deeper: {
          nested: randomData1,
        },
      },
      value2: randomData2,
      value3: {
        deeper: {
          evenDeeper: {
            value: randomData3,
          },
        },
      },
    };

    await when(DownloadJSON)
      .hasInput([feature])
      .and()
      .parameters({
        'attributes to download': [
          'value1.deeper.nested',
          'value2',
          'value3.deeper.evenDeeper.value',
        ],
        'pretty print json': 'false',
      })
      .assertDownloads([
        {
          nested: randomData1,
          value2: randomData2,
          value: randomData3,
        },
      ])
      .finish();
  });
});
