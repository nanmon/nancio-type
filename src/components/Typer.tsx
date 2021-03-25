import React from 'react';
import TypingTest from './TypingTest';
import Stats from './Stats';
import { useTyper, useTyperDispatch } from './StateProvider';

interface Props {
  nextContent(): Typer.Content;
}

function Typer({ nextContent }: Props) {

  const [state, dispatch] = [useTyper(), useTyperDispatch()!];

  function onType(e: React.KeyboardEvent<HTMLInputElement>) {
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
        ? <Stats state={state}/>
        : <TypingTest
            onType={onType}
          />
      }
      <button onClick={onNext}>Next</button>
    </>
  );
}

export default Typer;