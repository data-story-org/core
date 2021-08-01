export const trim = (s: string, c: string): string => {
  if (c === ']') c = '\\]';
  if (c === '^') c = '\\^';
  if (c === '\\') c = '\\\\';
  return s.replace(
    new RegExp('^[' + c + ']+|[' + c + ']+$', 'g'),
    '',
  );
};