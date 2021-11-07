import { Feature } from '../../src/Feature';

test('a Feature can be instantiate from various types', () => {
  ['str', 123, [], {}, { foo: 'bar' }].forEach((value) => {
    expect(new Feature(value)).toBeInstanceOf(Feature);
  });
});

test('a Feature can hold attributes', () => {
  const feature = new Feature({
    foo: 'bar',
  });

  expect(feature.get('foo')).toBe('bar');
});

test('it can get dot notated attributes', () => {
  const feature = new Feature({
    user: {
      name: 'ajthinking',
    },
  });

  expect(feature.get('user.name')).toBe('ajthinking');
});


test('it can parse template strings', () => {
	const feature = new Feature({
		name: 'Anders'
	});

	const greeting = "Hi {{ user.name }}!"

	expect(feature.parse(greeting)).toBe('Hi Anders!');
});

test('it can parse non template strings', () => {
	const feature = new Feature({});

	const greeting = "Hi!"

	expect(feature.parse(greeting)).toBe('Hi!');
});
