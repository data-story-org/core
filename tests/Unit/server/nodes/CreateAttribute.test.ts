import { CreateAttribute } from '../../../../src/server/nodes';
import { when } from '../NodeTester';

it('can add a attribute value to an object feature', async () => {
  await when(CreateAttribute)
    .hasInput([{}])
    .and()
    .parameters({
      'Atrribute & value to create': [
        {
          Attribute: { value: 'foo' },
          Value: { value: 'bar' },
        },
      ],
    })
    .assertOutput([{ foo: 'bar' }])
    .finish();
});

it('can add a attribute using a template syntax', async () => {
  await when(CreateAttribute)
    .hasInput([{name: 'ajthinking'}])
    .and()
    .parameters({
      'Atrribute & value to create': [
        {
          Attribute: { value: 'greeting' },
          Value: { value: "Hi {{ user.name }}!" },
        },
      ],
    })
    .assertOutput([{ name: 'ajthinking', greeting: 'Hi ajthinking!' }])
    .finish();
});
