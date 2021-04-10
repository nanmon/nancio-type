function typed(
  state: Banana.State,
  action: Banana.Actions.Typed
): Banana.State {
  let { bananas } = state;
  if (action.char === 'ignored') return state;
  const multiplier = action.char === 'correct' ? 1 : 0.5;
  bananas += state.bpt * multiplier;
  return {
    ...state,
    bananas
  }
}

export default typed;