function buyBuilding(
  state: Banana.State,
  action: Banana.Actions.BuyBuilding
): Banana.State {
  const buildings = [...state.buildings];
  const building = { ...buildings[action.buildingId] };
  if (!building) return state;
  if (state.bananas < building.price) return state;
  const newState = { ...state };
  newState.bananas -= building.price;
  building.owned++;
  building.price *= 1.15;
  buildings[action.buildingId] = building;
  newState.buildings = buildings;
  buildingUnlock(newState, building);
  return newState;
}

export default buyBuilding;

function buildingUnlock(
  state: Banana.State, 
  building: Banana.Building
) {
  state.upgrades.forEach(upgrade => {
    if ( upgrade.unlocked 
      || upgrade.lock.type !== 'building' 
      || upgrade.lock.buildingId !== building.id
      || upgrade.lock.needed > building.owned
    ) {
      return;
    }
    // did unlock
    const up = {...upgrade, unlocked: true};
    state.upgrades = [...state.upgrades];
    state.upgrades[up.id] = up;
  });
}