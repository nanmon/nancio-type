import React from 'react';
import { tuplify } from '../util/std';
import { getWords } from '../util/text'
import { useTyper } from './StateProvider'
import Caret from './Caret';
import Word from './Word';
import '../styles/TypingTest.css';
import { useCaret } from '../hooks/typing-test';

interface Props {
  onType(e: React.KeyboardEvent<HTMLInputElement>): boolean;
}

function TypingTest({ onType }: Props) {
  const { content, typed, config } = useTyper();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputHasFocus, setInputFocus] = React.useState(false);
  const [capslock, setCapslock] = React.useState(false);
  const caretPosition = useCaret(typed, config);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [content.text]);

  const typedWords = getWords(typed)
  const _words = tuplify(
    getWords(content.text),
    typedWords,
    [null, ...typedWords],
    typedWords.slice(1)
  )

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    const prevent = onType(e);
    if (prevent) e.preventDefault();
    capslockDetector(e);
  }

  function capslockDetector(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapslock(e.getModifierState('CapsLock'));
  }

  function isCurrent(word: string, prev: string, next: string) {
    if (!typed && !prev) return true;
    if (typed.endsWith(' ')) return prev != null && word == null;
    return word != null && next == null;
  }

  const offset = React.useMemo(() => {
    if (!caretPosition) return 0;
    const line = Math.floor(caretPosition.y / config.lineHeight);
    if (line < 1) return 0
    return (line - 1) * config.lineHeight;
  }, [caretPosition, config]);

  return (
    <div className="TypingTest" style={{
      fontFamily: config.fontFamily,
      fontSize: config.fontSize + 'px',
      lineHeight: (config.lineHeight - 2) + 'px', // 2px border bottom
      height: config.lineHeight * 3 + 'px'
    }}>
      <input 
        ref={inputRef}
        onKeyDown={onKeyPress}
        onKeyUp={capslockDetector}
        style={{height: 0, padding: 0, border: 0, position: "absolute"}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      {capslock && <p>CAPSLOCK IS ACTIVE</p>}
      <div 
        className="words" 
        onClick={() => inputRef.current?.focus()}
        style={{ width: config.width, transform: `translateY(${-offset}px)`}}
      >
        {_words.map(([text, typedWord, prevTyped, nextTyped], index) => 
          <Word
            key={index}
            text={text} 
            typed={typedWord}
            current={isCurrent(typedWord, prevTyped, nextTyped)} 
          />
        )}
        <Caret position={caretPosition} focused={inputHasFocus} />
      </div>
    </div>
  )
}

export default TypingTest;
