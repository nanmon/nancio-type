import { compose, last } from '../util/std';
import { words } from '../util/text';

export default compose(
  setTyped,
  setCount,
  setErrors,
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

function setErrors(state, { char }) {
  if (char === 'Backspace') return state;

  const { typed, content, stats } = state;
  const wordsTyped = words(typed);
  const lastWord = last(wordsTyped);
  const actualWord = words(content.text)[wordsTyped.length - 1];

  // it'd be like that sometimes
  if (!actualWord) return state;

  if (typed.endsWith(' ')){
    if (actualWord.length > lastWord.length) {
      return {
        ...state,
        stats: { ...stats, errors: stats.errors + 1 }
      };
    }
    return state;
  }

  const lastChar = lastWord[lastWord.length - 1];
  const actualChar = actualWord[lastWord.length - 1];
  if (actualChar === lastChar)
    return state;
  return {
    ...state,
    stats: { ...stats, errors: stats.errors + 1 }
  };
}