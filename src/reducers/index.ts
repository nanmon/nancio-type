import init from './init';
import typing from './typing';
import screen from './screen';

const ducers = {
  init,
  typing,
  screen
};

export default function reducer(
  state: Typer.State, 
  action: Typer.Actions.Any) 
{
  const r = ducers[action.type] as Reducer;
  if (!r) return state;
  return r(state, action);
}

type Reducer = (state: Typer.State, action: Typer.Actions.Any) => Typer.State;