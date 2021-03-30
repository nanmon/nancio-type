import { isDoneTyping } from '../util/handlers';
import { compose } from '../util/std';
import { IGNORED_CHARACTERS } from '../util/text';

const typing: (
  state: Typer.State, 
  action: Typer.Actions.Typing
) => Typer.State =  compose(
  setTyped,
  addToTimeline,
  setDone
);

export default typing;

function setTyped(
  state: Typer.State, 
  { char }: Typer.Actions.Typing
) {
  let { typed } = state;
  // dont add spaces together
  if (char === ' ' && typed.endsWith(' ')) return state;
  if (char === 'Backspace')
    typed = typed.substr(0, typed.length - 1);
  else typed = typed + char;
  return { ...state, typed };
}

function addToTimeline(
  state: Typer.State,
  { char, time }: Typer.Actions.Typing
) {
  if (!state.typed) {
    if (IGNORED_CHARACTERS.includes(char)) return state;
  }
  return {
    ...state,
    timeline: [
      ...state.timeline,
      { timestamp: time, char, typed: state.typed }
    ]
  };
}

function setDone(state: Typer.State) {
  if (isDoneTyping(state))
    return {
      ...state,
      screen: 'stats'
    }
  return state;
}
