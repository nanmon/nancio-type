import React from 'react';
import zip from 'lodash/zip';
import { getWords } from '../util/text';
import Word from './Word';
import '../styles/Line.css';

interface Props {
  text: string;
  typed: string;
}

const Line = React.memo(function ({ text, typed }: Props) {
  const typedWords = getWords(typed);
  const words = zip(
    getWords(text),
    typedWords,
    [undefined, ...typedWords],
    typedWords.slice(1)
  )

  function isCurrent(word?: string, prev?: string, next?: string) {
    if (!typed && !prev) return true;
    if (typed.endsWith(' ')) return prev != null && word == null;
    return word != null && next == null;
  }

  return (
    <div className="Line">
      {words.map(([text, typedWord, prevTyped, nextTyped], index) => 
        text && <Word
          key={index}
          text={text} 
          typed={typedWord}
          current={isCurrent(typedWord, prevTyped, nextTyped)} 
        />
      )}
    </div>
  );
});

export default Line;