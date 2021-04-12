function typed(
  state: Banana.State,
  action: Banana.Actions.Typed
): Banana.State {
  let { bananas } = state;
  if (action.char === 'ignored') return state;
  const multiplier = action.char === 'correct' ? 1 : 0.5;
  const made = state.bpt * multiplier 
    + state.bps * state.bpsMultiplier * state.typerCpsPercent / 100;
  bananas += made;
  
  const newState = {
    ...state,
    bananas,
    totalBananas: state.totalBananas + made,
    typerCount: state.typerCount + 1,
    typerTotalBananas: state.typerTotalBananas + made
  }
  typingUnlock(newState);
  return newState;
}

export default typed;

function typingUnlock(state: Banana.State) {
  state.upgrades = state.upgrades.map(upgrade => {
    if ( upgrade.unlocked 
      || upgrade.lock.type !== 'typing'
      || upgrade.lock.needed > state.typerTotalBananas
    ) {
      return upgrade;
    }
    return {...upgrade, unlocked: true};
  });
}