import { fullBps } from "../util/logic";

function tick(
  state: Banana.State,
  action: Banana.Actions.Tick
): Banana.State {
  const dt = action.timestamp - state.tech.lastTimestamp;
  const made = fullBps(state) * dt / 1000;
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
  unlockBuildings(state);
  unlockUpgrades(state);
  return newState;
}

export default tick;

function unlockBuildings(state: Banana.State) {
  const buildings = state.buildings.map(building => {
    if ( building.unlocked 
      || building.unlocksAt > state.totalBananas
    ) {
      return building;
    }
    return { ...building, unlocked: true };
  });
  state.buildings = buildings;
}

function unlockUpgrades(state: Banana.State) {
  state.upgrades = state.upgrades.map(upgrade => {
    if ( upgrade.unlocked 
      || upgrade.lock.type !== 'banana'
      || upgrade.lock.needed > state.totalBananas
    ) {
      return upgrade;
    }
    return {...upgrade, unlocked: true};
  });
}
