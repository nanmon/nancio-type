import init from './init';
import typing from './typing';
import screen from './screen';
import merge from './merge';

const ducers = {
  init,
  typing,
  screen,
  merge,
};

export default function reducer(
  state: Typer.State | null, 
  action: Typer.Actions.Any) 
{
  const r = ducers[action.type] as Reducer;
  if (!r) return state;
  return r(state, action);
}

type Reducer = (state: Typer.State | null, action: Typer.Actions.Any) => Typer.State;