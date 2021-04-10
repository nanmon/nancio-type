import React from 'react';
import zip from 'lodash/zip';
import { getWords, IGNORED_MODIFIERS } from '../util/text'
import { useTyper, useTyperDispatch } from './Typer'
import Caret from './Caret';
import Word from './Word';
import '../styles/TypingTest.css';
import { useCaret } from '../hooks/typing-test';

interface Props {
  onKeyPress(e: React.KeyboardEvent<HTMLInputElement>): boolean;
}

function TypingTest({ onKeyPress }: Props) {
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
  const _words = zip(
    getWords(content.text),
    typedWords,
    [undefined, ...typedWords],
    typedWords.slice(1)
  )

  function keyPressed(e: React.KeyboardEvent<HTMLInputElement>) {
    capslockDetector(e);
    if (onKeyPress(e)) return;
    const char = e.key;
    const ignore = IGNORED_MODIFIERS.some(mod => {
      return e.getModifierState(mod);
    })
    if (ignore) return;
    if (char.length === 1 || char === 'Backspace') {
      dispatch({ type: 'typing', char, time: Date.now() });
      e.preventDefault();
      return;
    }
  }

  function capslockDetector(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapslock(e.getModifierState('CapsLock'));
  }

  function isCurrent(word?: string, prev?: string, next?: string) {
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

  const threeLinesHeight = config.lineHeight * 3 + 10 // 10px padding

  return (
    <div className="TypingTest" style={{
      fontFamily: config.fontFamily,
      fontSize: config.fontSize + 'px',
      lineHeight: (config.lineHeight - 1) + 'px', // 1px border bottom
    }}>
      <input 
        ref={inputRef}
        onKeyDown={keyPressed}
        onKeyUp={capslockDetector}
        style={{height: 0, padding: 0, border: 0, position: "absolute"}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <p style={{visibility: capslock ? "visible" : "hidden"}}>
        CAPSLOCK IS ACTIVE
      </p>
      <div className="threeLines" style={{height: threeLinesHeight + 'px'}}>
        <div 
          className="words" 
          onClick={() => inputRef.current?.focus()}
          style={{ maxWidth: config.width, transform: `translateY(${-offset}px)`}}
        >
          {_words.map(([text, typedWord, prevTyped, nextTyped], index) => 
            text && <Word
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
