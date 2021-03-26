import React from 'react';
import { useTyper } from "./Typer";

interface Props {
  text?: string;
  typed?: string;
}

function Char({ text, typed }: Props) {
  const { config } = useTyper();
  const code = React.useMemo(() => {
    if (!typed) return 'left';
    if (!text) return 'extra';
    if (typed === text) return 'correct';
    return 'wrong';
  }, [text, typed]);
  const color = config.colors[code]
  const str = text || typed;
  const className = ['Char', code].join(' ')
  return (
    <span className={className} style={{color}}>{str}</span>
  );
}

export default Char;