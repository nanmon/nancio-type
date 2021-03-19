export const clamp = (min, max) => val => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export const compose = (...fns) => arg => {
  return fns.reduce((acc, fn) => fn(acc), arg)
}

export const last = array => {
  return array[array.length - 1];
}

export const fillBetween = fn => array => {
  const befores = array.slice(0, array.length - 1);
  const afters = array.slice(1);

  const res = tuplify(befores, afters)
    .map(([before, after]) => [before, fn(before, after)])
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