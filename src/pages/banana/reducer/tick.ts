function tick(
  state: Banana.State,
  action: Banana.Actions.Tick
): Banana.State {
  const dt = action.timestamp - state.tech.lastTimestamp;
  const bananas = state.bananas + state.bps * dt / 1000;
  return {
    ...state,
    bananas,
    tech: {
      ...state.tech,
      lastTimestamp: action.timestamp
    }
  };
}

export default tick;