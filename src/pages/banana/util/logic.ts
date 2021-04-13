import sum from 'lodash/sum';

export function fullBps(state: Banana.State) {
  const base = sum(state.buildings.map(b => 
    fullBuildingBps(state, b)
  ));
  return base * state.bpsMultiplier;
}

export function fullBpt(state: Banana.State) {
  const base = state.typer.bpt;
  const gain = sum(state.buildings.slice(1).map(b => 
    b.owned * state.typer.gain
  ));
  const bps = fullBps(state) * state.typer.cpsPercent / 100;
  return (base + gain) * state.typer.multiplier + bps;
}

export function fullBuildingBps(
  state: Banana.State, 
  building: Banana.Building
) {
  return buildingBpsPerOwned(state, building) * building.owned;
}

export function buildingBpsPerOwned(
  state: Banana.State, 
  building: Banana.Building
) {
  const noGain = building.baseBps * building.multiplier;
  if (building.id !== 0) return noGain * state.bpsMultiplier;
  const gain = sum(state.buildings.slice(1).map(b => 
    b.owned * state.typer.gain
  ));
  return (noGain + gain) * state.bpsMultiplier;
}