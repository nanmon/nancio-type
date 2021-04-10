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
  newState.bps += building.bps;
  building.owned++;
  building.price *= 1.15;
  buildings[action.buildingId] = building;
  newState.buildings = buildings;
  return newState;
}

export default buyBuilding;