import sum from 'lodash/sum'

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
  if (effect.buildingId === 0) {
    state.bpt *= effect.multiplier
  }
  const buildings = [...state.buildings];
  const building = {...buildings[effect.buildingId]};
  state.bps += building.bps * (effect.multiplier - 1) * building.owned;
  building.bps *= effect.multiplier;
  buildings[effect.buildingId] = building;
  state.buildings = buildings;
}

function gain(state: Banana.State, effect: Banana.Effects.Gain) {
  let multiplier: number;
  if (effect.gainType === 'add') {
    multiplier = effect.gain;
    state.typerGain += effect.gain;
  } else {
    multiplier = state.typerGain * (effect.gain - 1);
    state.typerGain *= effect.gain;
  }
  const count = sum(state.buildings.slice(1).map(b => b.owned));
  state.bpt += count * multiplier;
  const buildings = [...state.buildings];
  const typewriter = {...buildings[0]};
  typewriter.bps += count * multiplier;
  buildings[0] = typewriter;
  state.buildings = buildings;
}