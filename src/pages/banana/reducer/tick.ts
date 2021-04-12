function tick(
  state: Banana.State,
  action: Banana.Actions.Tick
): Banana.State {
  const dt = action.timestamp - state.tech.lastTimestamp;
  const made = state.bps * dt / 1000
  const bananas = state.bananas + made;
  const newState = {
    ...state,
    bananas,
    totalBananas: state.totalBananas + made,
    tech: {
      ...state.tech,
      lastTimestamp: action.timestamp
    }
  };
  unlockBuildings(state)
  return newState;
}

export default tick;

function unlockBuildings(state: Banana.State) {
  const buildings = state.buildings.map(building => {
    if (!building.unlocked && state.totalBananas >= building.unlocksAt)
      return {
        ...building,
        unlocked: true
      }
    return building;
  });
  state.buildings = buildings;
}
