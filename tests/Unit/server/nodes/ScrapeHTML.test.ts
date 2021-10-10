import axios from 'axios';
import { ScrapeHTML } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

const html = `
<body>
	<h1>Persons</h1>
	<ul class="persons-list">
		<li class="person-card">
			<h2 class="person-name">Jerry</h2>
			<p class="person-skill">C++</p>
		</li>
		<li class="person-card">
			<h2 class="person-name">Jane</h2>
			<p class="person-skill">Rust</p>
		</li>			
	</ul>		
</body>	
`;

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({
  data: html,
});

describe('ScrapeHTML node', () => {
  it('can extract attributes', async () => {
    await when(ScrapeHTML)
      .hasParameters({
        url: 'https://faked-persons.html',
        'Root selector': '.person-card',
        'Attribute extractions': [
          {
            attribute: { value: 'name' },
            selector: { value: '.person-name' },
            method: { value: 'single' },
          },
          {
            attribute: { value: 'skill' },
            selector: { value: '.person-skill' },
            method: { value: 'single' },
          },
        ],
      })
      .assertOutput([
        { name: 'Jerry', skill: 'C++' },
        { name: 'Jane', skill: 'Rust' },
      ])
      .finish();
  });
});
