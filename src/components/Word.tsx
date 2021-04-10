import React from "react";
import zip from 'lodash/zip';
import Char from "./Char";
import { useTyper } from "./Typer";
import { getChars, getWidth } from "../util/text";
import '../styles/Word.css';

interface Props {
  text: string;
  typed?: string;
  current: boolean;
}

const Word = React.memo(function Word({ text, typed, current }: Props) {
  const { config } = useTyper();
  const _chars = zip(
    getChars(text),
    getChars(typed),
  );
  const redline = !current && typed && text !== typed;
  const className = [
    "Word", 
    redline && 'redline',
    current && 'current'
  ].filter(c => c).join(' ');
  const space = getWidth(' ', config);
  return (
    <div 
      className={className} 
      style={{
        marginRight: space, 
        borderBottomColor: redline ? config.colors.wrong : 'transparent'
      }}
    >
      {_chars.map(([text, typed], index) => 
        <Char 
          key={index}
          text={text}
          typed={typed}
        />
      )}
    </div>
  );
});

export default Word;