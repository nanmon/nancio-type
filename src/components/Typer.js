
import React from 'react';
import TypingText from './TypingText';
import Stats from './Stats';
import { useTyper, useTyperDispatch } from '../util/state';

function Typer({ nextContent }) {

  const [state, dispatch] = [useTyper(), useTyperDispatch()];

  React.useEffect(() => {
    if (state.screen === 'typing' &&  doneTyping(state)) {
      dispatch({ type: 'screen', screen: 'stats' });
    }
  }, [state, dispatch]);

  React.useEffect(() => {
    if (state.screen !== 'typing') return;
    const intervalId = setInterval(() => {
      dispatch({ type: 'interval', delta: 1 });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [state.screen, dispatch]);
  
  function onType(e) {
    const char = e.key;
    if (char.length === 1 || char === 'Backspace') {
      dispatch({ type: 'typing', char });
      return true;
    }
    return false;
  }

  function onNext() {
    dispatch({ type: 'restart', content: nextContent() })
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