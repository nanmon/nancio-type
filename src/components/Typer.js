import React from 'react';
import TypingText from './TypingText';
import Stats from './Stats';
import { useTyper, useTyperDispatch } from './StateProvider';

function Typer({ nextContent }) {

  const [state, dispatch] = [useTyper(), useTyperDispatch()];

  React.useEffect(() => {
    if (state.screen === 'typing' &&  doneTyping(state)) {
      dispatch({ type: 'screen', screen: 'stats' });
    }
  }, [state, dispatch]);

  function onType(e) {
    const char = e.key;
    if (char.length === 1 || char === 'Backspace') {
      dispatch({ type: 'typing', char, time: Date.now() });
      return true;
    }
    return false;
  }

  function onNext() {
    dispatch({ type: 'init', content: nextContent() })
  }

  return (
    <>
      {state.screen === 'stats' 
        ? <Stats state={state} onNext={onNext}/>
        : <TypingText
            onType={onType}
          />
      }
      <button onClick={onNext}>Next</button>
    </>
  );
}

export default Typer;

function doneTyping({typed, content}) {
  const typedWords = typed.split(' ').filter(w => w);
  const allWords = content.text.split(' ');
  if (typedWords.length < allWords.length) return false;
  if (typed.endsWith(' ')) return true;
  const lastTyped = typedWords.pop();
  const lastWord = allWords.pop();
  return lastTyped === lastWord;
}