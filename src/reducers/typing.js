export default function typing(state, action) {
  let { typed } = state;
  if (action.char === 'Backspace')
    typed = typed.substr(0, typed.length - 1)
  else if(action.char === ' ' && typed.endsWith(' ')){
    // dont add space if space already there
  } else typed = typed + action.char
  return {  
    ...state,
    typed,
    stats: {
      ...state.stats,
      count: state.stats.count + 1,
      errors: state.stats.errors + Number(didErr(typed, state.content))
    }
  }
}


function didErr(typed, {text}) {
  if (typed.endsWith(' ')) return false;
  const wordsTyped = typed.split(' ');
  const lastWord = wordsTyped[wordsTyped.length - 1];
  const actualWord = text.split(' ')[wordsTyped.length - 1];
  return !!actualWord && actualWord[lastWord.length - 1] !== lastWord[lastWord.length - 1];
}