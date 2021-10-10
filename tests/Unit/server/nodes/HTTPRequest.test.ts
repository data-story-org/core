import axios from 'axios';
import { HTTPRequest } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HTTPRequest node', () => {
	it('can make succesful get requests', async () => {
		mockedAxios.get.mockResolvedValue({
			data: [1,2,3]
		});

		await when(HTTPRequest)
			.hasInput('a triggering feature')
			.hasParameters({
				url: 'https://faked.numbers',
			})
			.assertOutputCounts({'Response': 1, 'Features': 3})
			.assertOutputs({
				Features: [1,2,3]
			})
			.finish();
	})

	it('can outputs failed get requests', async () => {
		mockedAxios.get.mockRejectedValue({});
				
		await when(HTTPRequest)
			.hasInput('a feature triggering a failure')
			.hasParameters({
				url: 'https://some.url',
			})
			.assertOutputCounts({Failed: 1})
			.finish();
	})	
});
