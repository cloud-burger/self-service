export const removeNullValues = <T>(object: T): T => {
  const obj = object;

  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === 'object') {
      removeNullValues(obj[key]);
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
      delete obj[key];
    }
  });

  return obj;
};
