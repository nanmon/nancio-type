function buyUpgrade(
  state: Banana.State,
  action: Banana.Actions.BuyUpgrade
): Banana.State {
  const upgrades = [...state.upgrades];
  const upgrade = {...upgrades[action.upgradeId]};
  if (!upgrade) return state;
  if (!upgrade.unlocked) return state;
  if (state.bananas < upgrade.price) return state;
  const newState = {...state};
  newState.bananas -= upgrade.price;
  upgrade.bought = true;
  upgrades[action.upgradeId] = upgrade;
  newState.upgrades = upgrades;
  upgrade.effects.forEach(effect => {
    const effectFn = effects[effect.type] as EffectFn
    effectFn(newState, effect);
  })
  return newState;
}

export default buyUpgrade;

type EffectFn = (state: Banana.State, effect: Banana.Effects.Any) => void

const effects = {
  efficiency,
  gain
}

function efficiency(state: Banana.State, effect: Banana.Effects.Efficiency) {
  if (effect.buildingId === -1) {
    state.bpt *= effect.multiplier
  } else {
    const buildings = [...state.buildings];
    const building = {...buildings[effect.buildingId]};
    state.bps += building.bps * (effect.multiplier - 1) * building.owned;
    building.bps *= effect.multiplier;
    buildings[effect.buildingId] = building;
    state.buildings = buildings;
  }
}

function gain(state: Banana.State, effect: Banana.Effects.Gain) {
  // if (effect.buildingId === -1) {
  //   state.bpt *= effect.multiplier
  // } else {
  //   const buildings = [...state.buildings];
  //   const building = {...buildings[effect.buildingId]};
  //   building.bps *= effect.multiplier;
  //   buildings[effect.buildingId] = building;
  //   state.buildings = buildings;
  // }
}