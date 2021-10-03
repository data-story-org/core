import { ScrapeHTML } from '../../../../src/server/nodes/ScrapeHTML';
import { when } from '../NodeTester';

describe('ScrapeHTML node', () => {
  it('DESCRIPTION', async () => {
    await when(ScrapeHTML)
      .hasDefaultParameters()
      .assertCanRun()
      .finish();
  });
});
