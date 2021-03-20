import init from './init';
import typing from './typing';
import interval from './interval';
import screen from './screen';

const ducers = {
  init,
  typing,
  interval,
  screen
}
export default function reducer(state, action) {
  const r = ducers[action.type];
  if (!r) return state;
  return r(state, action);
}