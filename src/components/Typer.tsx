import React from 'react';
import TypingTest from './TypingTest';
import Stats from './Stats';
import { useTyper, useTyperDispatch } from './StateProvider';

interface Props {
  onNext(): void;
}

function Typer({ onNext }: Props) {

  const [state, dispatch] = [useTyper(), useTyperDispatch()!];

  function onType(e: React.KeyboardEvent<HTMLInputElement>) {
    const char = e.key;
    if (char.length === 1 || char === 'Backspace') {
      dispatch({ type: 'typing', char, time: Date.now() });
      return true;
    }
    return false;
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