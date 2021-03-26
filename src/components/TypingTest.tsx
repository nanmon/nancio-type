import React from 'react';
import { tuplify } from '../util/std';
import { getWords } from '../util/text'
import { useTyper, useTyperDispatch } from './Typer'
import Caret from './Caret';
import Word from './Word';
import '../styles/TypingTest.css';
import { useCaret } from '../hooks/typing-test';

function TypingTest() {
  const { content, typed, config } = useTyper();
  const dispatch = useTyperDispatch();

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
    capslockDetector(e);
    const char = e.key;
    if (char.length === 1 || char === 'Backspace') {
      dispatch({ type: 'typing', char, time: Date.now() });
      e.preventDefault();
      return;
    }
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
    }}>
      <input 
        ref={inputRef}
        onKeyDown={onKeyPress}
        onKeyUp={capslockDetector}
        style={{height: 0, padding: 0, border: 0, position: "absolute"}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <p style={{visibility: capslock ? "visible" : "hidden"}}>
        CAPSLOCK IS ACTIVE
      </p>
      <div className="threeLines" style={{height: config.lineHeight * 3 + 'px'}}>
        <div 
          className="words" 
          onClick={() => inputRef.current?.focus()}
          style={{ maxWidth: config.width, transform: `translateY(${-offset}px)`}}
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
    </div>
  )
}

export default TypingTest;
