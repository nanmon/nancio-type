import React from 'react';
import TypingTest from './TypingTest';
import Stats from './Stats';
import { useTyper } from './Typer';

interface Props {
  onKeyPress(e: React.KeyboardEvent<HTMLInputElement>): boolean;
}

function Screens({ onKeyPress }: Props) {
  const { screen } = useTyper();

  return screen === 'stats' 
        ? <Stats />
        : <TypingTest onKeyPress={onKeyPress} />;
}

export default Screens;