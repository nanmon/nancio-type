function merge(state: Typer.State, action: Typer.Actions.Merge): Typer.State {
  let diff = Object.entries(action.state)
    .some(([key, val]) => state[key] !== val);
  if (!diff) return state;
  return {
    ...state,
    ...action.state,
  }
}

export default merge;