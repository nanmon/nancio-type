
import React from 'react';
import TypingText from './TypingText';
import Stats from './Stats';
import { useTyper } from '../util/state';
const { quotes } = require('../quotes.json')

const WIDTH = 1000;

function Typer() {
  const [state, dispatch] = useTyper(randomQuote);

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
    }
    if (char === 'Tab') return false;
    return true;
  }

  function onNext() {
    dispatch({ type: 'restart', content: randomQuote() })
  }

  return (
    <>
      {state.screen === 'stats' 
        ? <Stats state={state} onNext={onNext}/>
        : <TypingText 
            typed={state.typed} 
            text={state.content.text} 
            maxWidth={WIDTH}
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

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}