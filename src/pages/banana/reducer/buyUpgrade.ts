function buyUpgrade(
  state: Banana.State,
  action: Banana.Actions.BuyUpgrade
): Banana.State {
  const upgrades = [...state.upgrades];
  const upgrade = {...upgrades[action.upgradeId]};
  if (!upgrade) return state;
  if (!upgrade.unlocked) return state;
  if (upgrade.bought) return state;
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
  gain,
  typing,
  bpsMultiplier
}

function efficiency(state: Banana.State, effect: Banana.Effects.Efficiency) {
  if (effect.buildingId === 0) {
    const typer = {...state.typer};
    typer.multiplier *= effect.multiplier
    state.typer = typer;
  }
  const buildings = [...state.buildings];
  const building = {...buildings[effect.buildingId]};
  building.multiplier *= effect.multiplier;
  buildings[effect.buildingId] = building;
  state.buildings = buildings;
}

function gain(state: Banana.State, effect: Banana.Effects.Gain) {
  const typer = {...state.typer};
  if (effect.gainType === 'add') {
    typer.gain += effect.gain;
  } else {
    typer.gain *= effect.gain;
  }
  state.typer = typer;
}

function typing(state: Banana.State, effect: Banana.Effects.Typing) {
  const typer = {...state.typer};
  typer.cpsPercent += effect.cpsPercent;
  state.typer = typer;
}

function bpsMultiplier(
  state: Banana.State, 
  effect: Banana.Effects.BpsMultiplier
) {
  state.bpsMultiplier += effect.bonus;
}