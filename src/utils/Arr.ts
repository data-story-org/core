import { get } from './Obj';

export const groupBy = (items, key) => {
  return items.reduce(
    (result, item) => ({
      ...result,
      [get(item, key)]: [
        ...(result[get(item, key)] || []),
        item,
      ],
    }),
    {},
  );
};

export const zip = (...arrays: Array<Array<any>>) => {
  const minLen = Math.min(
    ...arrays.map((arr) => arr.length),
  );

  const [firstArr, ...restArrs] = arrays;
  return firstArr
    .slice(0, minLen)
    .map((val, i) => [
      val,
      ...restArrs.map((arr) => arr[i]),
    ]);
};
