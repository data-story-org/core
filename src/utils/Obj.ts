export const get = (object, path = '') => {
  const steps = path ? path.split('.') : [];
  return steps.reduce((traversed, part) => {
    if (typeof traversed !== 'object' || traversed === null)
      return null;
    return traversed[part] ?? null;
  }, object);
};

export const pickBy = (object, picker) => {
  const result = {};

  for (const [key, value] of Object.entries(object)) {
    if (picker(value, key)) {
      result[key] = value;
    }
  }

  return result;
};

export const clone = <T>(obj: T) => Object.assign({}, obj);

export const cloneClass = <T>(obj: T) =>
  Object.assign(
    Object.create(Object.getPrototypeOf(obj)),
    obj,
  );

export const renameKey = (object, key, newKey) => {
  const clonedObj = clone(object);
  const targetKey = clonedObj[key];

  delete clonedObj[key];
  clonedObj[newKey] = targetKey;

  return clonedObj;
};
