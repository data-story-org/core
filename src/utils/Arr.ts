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

export const zip = <A, B>(
  a: Array<A> | ReadonlyArray<A>,
  b: Array<B> | ReadonlyArray<B>,
) => a.map((ele: A, i: number) => [ele, b[i]]);
