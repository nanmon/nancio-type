import { isDoneTyping } from '../util/handlers';
import { compose, last } from '../util/std';
import { getWords } from '../util/text';

const typing: (
  state: Typer.State, 
  action: Typer.Actions.Typing
) => Typer.State =  compose(
  setTyped,
  setCount,
  setErrors,
  setTemp,
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

function setCount(
  state: Typer.State, 
  { char }: Typer.Actions.Typing
) {
  if (['', 'Backspace'].includes(char)) 
    return state;
  return {
    ...state,
    stats: { ...state.stats, count: state.stats.count + 1 }
  };
}

function setErrors(
  state: Typer.State, 
  action: Typer.Actions.Typing
) {
  const misses = mistypes(state, action)
  if (misses > 0)
    return {
      ...state,
      stats: { ...state.stats, errors: state.stats.errors + misses }
    };
  return state;
}

function setTemp(
  state: Typer.State, 
  { time, char }: Typer.Actions.Typing
) {
  const { temp } = state;
  if (temp.prevTime === 0) {
    return {
      ...state,
      temp: {
        delta: 0,
        prevTime: time,
        count: ['', 'Backspace'].includes(char) ? 0 : 1,
        errors: mistypes(state, { char })
      }
    }
  }
  let delta = temp.delta + (time - temp.prevTime);
  if (delta < 1000) {
    return {
      ...state,
      temp: {
        delta,
        prevTime: time,
        count: char === 'Backspace' ? temp.count : temp.count + 1,
        errors: temp.errors + mistypes(state, { char })
      }
    }
  }
  let newState = {...state};
  while (delta > 1000) {
    delta -= 1000;
    newState = flushStats(newState, { time, char }, delta);
    char = '';
  }
  return newState;
}

function setDone(state: Typer.State) {
  if (isDoneTyping(state))
    return {
      ...state,
      screen: 'stats'
    }
  return state;
}

function mistypes(
  state: Typer.State, 
  { char }: Pick<Typer.Actions.Typing, 'char'>
) {
  if (['', 'Backspace'].includes(char)) return 0;

  const { typed, content } = state;
  const wordsTyped = getWords(typed);
  const lastWord = last(wordsTyped);
  const actualWord = getWords(content.text)[wordsTyped.length - 1];

  // it'd be like that sometimes
  if (!actualWord) return 0;

  if (typed.endsWith(' ')) {
    // not extra, missing
    const missing = actualWord.length - lastWord.length;
    return missing > 0 ? missing : 0;
  }

  const lastChar = lastWord[lastWord.length - 1];
  const actualChar = actualWord[lastWord.length - 1];
  return actualChar !== lastChar ? 1 : 0;
}

function flushStats(
  state: Typer.State, 
  { time, char }: Pick<Typer.Actions.Typing, 'time' | 'char'>, 
  newDelta: number
) {
  const pm = 1 / 60 * 5;
  const wpm = state.temp.count / pm;
  return {
    ...state,
    stats: {
      ...state.stats,
      wpm: [...state.stats.wpm, wpm],
      errs: [...state.stats.errs, state.temp.errors]
    },
    temp: {
      delta: newDelta,
      prevTime: time,
      count: ['', 'Backspace'].includes(char) ? 0 : 1,
      errors: mistypes(state, { char })
    }
  };
}
