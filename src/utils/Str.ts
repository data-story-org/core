export const trim = (s: string, c: string): string => {
  if (c === ']') c = '\\]';
  if (c === '^') c = '\\^';
  if (c === '\\') c = '\\\\';
  return s.replace(
    new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'),
    '',
  );
};

export function camelCasePrepend(prepend: string, original: string): string {
  return prepend + original.charAt(0).toUpperCase() + original.slice(1);
}
