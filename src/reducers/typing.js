import { compose, last } from '../util/std';
import { words } from '../util/text';

export default compose(
  setTyped,
  setCount,
  setErrors,
  setTemp,
  setDone
)

function setTyped(state, { char }) {
  let { typed } = state;
  // dont add spaces together
  if (char === ' ' && typed.endsWith(' ')) return state;
  if (char === 'Backspace')
    typed = typed.substr(0, typed.length - 1);
  else typed = typed + char;
  return { ...state, typed };
}

function setCount(state, { char }) {
  if (['', 'Backspace'].includes(char)) 
    return state;
  return {
    ...state,
    stats: { ...state.stats, count: state.stats.count + 1 }
  };
}

function setErrors(state, action) {
  if (mistype(state, action))
    return {
      ...state,
      stats: { ...state.stats, errors: state.stats.errors + 1 }
    };
  return state;
}

function setTemp(state, { time, char }) {
  const { temp } = state;
  if (temp.prevTime === 0) {
    return {
      ...state,
      temp: {
        delta: 0,
        prevTime: time,
        count: ['', 'Backspace'].includes(char) ? 0 : 1,
        errors: mistype(state, { char }) ? 1 : 0
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
        errors: mistype(state, { char }) ? temp.errors + 1 : temp.errors
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

function setDone(state) {
  if (doneTyping(state))
    return {
      ...state,
      screen: 'stats'
    }
  return state;
}

function mistype(state, { char }) {
  if (['', 'Backspace'].includes(char)) return false;

  const { typed, content } = state;
  const wordsTyped = words(typed);
  const lastWord = last(wordsTyped);
  const actualWord = words(content.text)[wordsTyped.length - 1];

  // it'd be like that sometimes
  if (!actualWord) return false;

  if (typed.endsWith(' '))
    return actualWord.length > lastWord.length;

  const lastChar = lastWord[lastWord.length - 1];
  const actualChar = actualWord[lastWord.length - 1];
  return actualChar !== lastChar;
}

function flushStats(state, { time, char }, newDelta) {
  const pm = 1 / 60 * 5;
  const wpm = state.temp.count / pm;
  if (wpm > 200) debugger;
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
      errors: mistype(state, { char }) ? 1 : 0
    }
  };
}

function doneTyping({ typed, content }) {
  const typedWords = words(typed);
  const allWords = words(content.text);
  if (typedWords.length < allWords.length) return false;
  if (typed.endsWith(' ')) return true;
  const lastTyped = typedWords.pop();
  const lastWord = allWords.pop();
  return lastTyped === lastWord;
}