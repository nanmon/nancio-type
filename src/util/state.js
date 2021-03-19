import React from 'react';

export function useTyper(firstContent) {
  return React.useReducer(reducer, null, () => init(firstContent()))
}

function init(content = {text: ''}) {
  return {
    content,
    typed: '',
    screen: 'typing',
    stats: {
      count: 0, prevCount: 0, wpm: [], errors: 0
    }
  }
}

function reducer(state, action) {
  switch(action.type) {
    case 'typing':
      const typed = action.char === 'Backspace' 
        ? state.typed.substr(0, state.typed.length - 1)
        : state.typed + action.char
      return {  
        ...state,
        typed,
        stats: {
          ...state.stats,
          count: state.stats.count + 1,
          errors: state.stats.errors + Number(didErr(typed, state.content))
        }
      }
    case 'interval':
      if (state.stats.count === 0) return state;
      const k = action.delta / 60 * 5; //transform to wpm
      return {
        ...state,
        stats: {
          ...state.stats,
          prevCount: state.stats.count,
          wpm: [
            ...state.stats.wpm,
            (state.stats.count - state.stats.prevCount) / k
          ]
        }
      }
    case 'restart': return init(action.content);
    case 'screen': 
      return {
        ...state,
        screen: action.screen
      }
    default: return state;
  }
}


function didErr(typed, {text}) {
  if (typed.endsWith(' ')) return false;
  const wordsTyped = typed.split(' ');
  const lastWord = wordsTyped[wordsTyped.length - 1];
  const actualWord = text.split(' ')[wordsTyped.length - 1];
  return !!actualWord && actualWord[lastWord.length - 1] !== lastWord[lastWord.length - 1];
}