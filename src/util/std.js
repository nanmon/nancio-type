export const clamp = (min, max) => val => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export const compose = (...fns) => (arg, ...rest) => {
  return fns.reduce((acc, fn) => fn(acc, ...rest), arg);
}

export const last = array => {
  return array[array.length - 1];
}

export const fillBetween = fn => array => {
  const befores = array.slice(0, array.length - 1);
  const afters = array.slice(1);

  const res = tuplify(befores, afters)
    .map(([before, after], index) => [before, fn(before, after, index)])
    .flat();
  res.push(last(array));
  return res;
}

export const tuplify = (firstItems, ...arrays) => {
  return firstItems.map((first, index) => {
    return [
      first, 
      ...arrays.map(arr => arr[index])
    ];
  });
}

export const memoize = (fn, stackSize = 15) => {
  const memory = {};
  const keyStack = [];
  return (...args) => {
    const key = JSON.stringify(args);
    if (!memory[key]) 
      memory[key] = fn(...args);
    
    // key cache
    const keyIndex = keyStack.indexOf(key);
    if (keyIndex !== -1) keyStack.splice(keyIndex, 1);
    else if (keyStack.length >= stackSize) {
      const oldKey = keyStack.shift();
      delete memory[oldKey];
    }
    keyStack.push(key);

    return memory[key];
  }
}

export const spread = (obj, path, value) => {
  const [key, ...otherKeys] = path;
  if (typeof key === 'number') {
    return [
      ...obj.slice(0, key),
      otherKeys.length === 0
        ? value
        : spread(obj[key], otherKeys.join('.'), value),
      ...obj.slice(key)
    ]
  }
  return {
    ...obj,
    [key]: otherKeys.length === 0
      ? value
      : spread(obj[key], otherKeys.join('.'), value)
  }
}