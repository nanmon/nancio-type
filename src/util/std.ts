interface ArrayLike {
  [index: number]: any; 
  length: number
}

export const clamp = (min: number, max: number) => (val: number) => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

export const compose = (...fns: Function[]) => (arg: any, ...rest: any[]) => {
  return fns.reduce((acc, fn) => fn(acc, ...rest), arg);
}

export const last = (array: ArrayLike) => {
  return array[array.length - 1];
}

export const fillBetween = (
  fn: Function
) => (array: any[]) => {
  const befores = array.slice(0, array.length - 1);
  const afters = array.slice(1);

  const res = tuplify(befores, afters)
    .map(([before, after], index) => [before, fn(before, after, index)])
    .flat();
  res.push(last(array));
  return res;
}

export const tuplify = (firstItems: any[], ...arrays: any[][]) => {
  return firstItems.map((first, index) => {
    return [
      first, 
      ...arrays.map(arr => arr[index])
    ];
  });
}

export const memoize = (fn: Function, stackSize = 15) => {
  const memory: Record<string, any> = {};
  const keyStack: string[] = [];
  return (...args: any[]) => {
    const key = JSON.stringify(args);
    if (!memory[key]) 
      memory[key] = fn(...args);
    
    // key cache
    const keyIndex = keyStack.indexOf(key);
    if (keyIndex !== -1) keyStack.splice(keyIndex, 1);
    else if (keyStack.length >= stackSize) {
      const oldKey = keyStack.shift();
      delete memory[oldKey!];
    }
    keyStack.push(key);

    return memory[key];
  }
}

export const spread = (obj: {[k:string]: any} | any[], path: (string | number)[], value: any): object => {
  const [key, ...otherKeys] = path;
  if (obj instanceof Array) {
    return [
      ...obj.slice(0, Number(key)),
      otherKeys.length === 0
        ? value
        : spread(obj[Number(key)], otherKeys, value),
      ...obj.slice(Number(key))
    ]
  }
  return {
    ...obj,
    [key]: otherKeys.length === 0
      ? value
      : spread(obj[key + ''], otherKeys, value)
  }
}

export function sum(array: number[]) {
  return array.reduce((s, v) => s + v, 0);
}

export function avg(array: number[]) {
  return sum(array) / array.length;
}