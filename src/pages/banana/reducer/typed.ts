import { fullBpt } from "../util/logic";

function typed(
  state: Banana.State,
  action: Banana.Actions.Typed
): Banana.State {
  let { bananas } = state;
  if (action.char === 'ignored') return state;
  const multiplier = action.char === 'correct' ? 1 : 0.5;
  const made = fullBpt(state) * multiplier;
  bananas += made;
  
  const newState = {
    ...state,
    bananas,
    totalBananas: state.totalBananas + made,
    typer: {
      ...state.typer,
      count: state.typer.count + 1,
      totalBananas: state.typer.totalBananas + made
    }
  }
  typingUnlock(newState);
  return newState;
}

export default typed;

function typingUnlock(state: Banana.State) {
  state.upgrades = state.upgrades.map(upgrade => {
    if ( upgrade.unlocked 
      || upgrade.lock.type !== 'typing'
      || upgrade.lock.needed > state.typer.totalBananas
    ) {
      return upgrade;
    }
    return {...upgrade, unlocked: true};
  });
}