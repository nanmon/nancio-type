import React from 'react';
import zip from 'lodash/zip';
import { getCaretPosition, getWords, IGNORED_MODIFIERS } from '../util/text'
import { useTyper, useTyperDispatch } from './Typer'
import Caret from './Caret';
import '../styles/TypingTest.css';
import Line from './Line';

interface Props {
  onKeyPress(e: React.KeyboardEvent<HTMLInputElement>): boolean;
}

function TypingTest({ onKeyPress }: Props) {
  const { content, typed, config } = useTyper();
  const dispatch = useTyperDispatch();

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputHasFocus, setInputFocus] = React.useState(false);
  const [capslock, setCapslock] = React.useState(false);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, [content.text]);

  
  const lines = React.useMemo(() => {
    const typedWords = getWords(typed)
    const words = zip(
      getWords(content.text),
      typedWords,
      [undefined, ...typedWords],
      typedWords.slice(1)
    )
    let currentLength = 0;
    let currentLine: [string, string] = ['', '']
    const lines: [string, string][] = [];
    words.forEach(([word, typed]) => {
      if (!word) return;
      let wlength = word.length;
      if (typed && typed.length > word.length) wlength = typed.length;
      if (currentLength + 1 + wlength > config.width) {
        currentLength = wlength;
        lines.push(currentLine);
        currentLine = [word, typed || '']
      } else {
        currentLength += 1 + wlength;
        currentLine[0] += ' ' + word;
        if (typed) currentLine[1] += ' ' + typed;
      }
    });
    return lines;
  }, [typed, content, config.width]);

  const caret = React.useMemo(() => {
    return getCaretPosition(lines.map(([t]) => t), typed);
  }, [lines, typed]);

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

  const offset = React.useMemo(() => {
    if (!caret) return 0;
    const line = caret[1]
    if (line < 1) return 0
    return (line - 1) * config.lineHeight;
  }, [caret, config]);

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
          style={{ transform: `translateY(${-offset}px)`}}
        >
          {lines.map(([text, typed], index) => 
            text && <Line
              key={index}
              text={text} 
              typed={typed}
            />
          )}
          <Caret position={caret} focused={inputHasFocus} />
        </div>
      </div>
    </div>
  )
}

export default TypingTest;
