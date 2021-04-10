function merge(state: Typer.State, action: Typer.Actions.Merge): Typer.State {
  let diff = false;
  Object.entries(action.state).find(([key, val]) => {
    if (state[key] !== val) {
      diff = true;
      return true;
    }
    return false;
  });
  if (!diff) return state;
  return {
    ...state,
    ...action.state,
  }
}

export default merge;