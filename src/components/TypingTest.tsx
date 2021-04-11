import React from 'react';
import { getCaretPosition, getLines, getWidth, IGNORED_MODIFIERS } from '../util/text'
import { useTyper, useTyperDispatch } from './Typer'
import Caret from './Caret';
import '../styles/TypingTest.css';
import Line from './Line';

interface Props {
  onKeyPress(
    e: React.KeyboardEvent<HTMLInputElement>,
    direction: 'up' | 'down'
  ): boolean;
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
   return getLines(content.text, typed, config); 
  }, [typed, content, config]);

  const caret = React.useMemo(() => {
    return getCaretPosition(lines.map(([t]) => t), typed);
  }, [lines, typed]);

  function keyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    capslockDetector(e);
    if (onKeyPress(e, 'down')) return;
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

  function keyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyPress(e, 'up');
    capslockDetector(e);
  }

  function capslockDetector(e: React.KeyboardEvent<HTMLInputElement>) {
    setCapslock(e.getModifierState('CapsLock'));
  }

  const drawingLines = React.useMemo(() => {
    if (caret[1] < 2) return lines.slice(0, 3);
    return lines.slice(caret[1] - 1, caret[1] + 2);
  }, [lines, caret]);

  const threeLinesHeight = config.lineHeight * 3 + 10 // 10px padding

  return (
    <div className="TypingTest" style={{
      fontFamily: config.fontFamily,
      fontSize: config.fontSize + 'px',
      lineHeight: (config.lineHeight - 1) + 'px', // 1px border bottom
    }}>
      <input 
        ref={inputRef}
        onKeyDown={keyDown}
        onKeyUp={keyUp}
        style={{height: 0, padding: 0, border: 0, position: "absolute"}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <p style={{visibility: capslock ? "visible" : "hidden"}}>
        CAPSLOCK IS ACTIVE
      </p>
      <div className="threeLines" style={{
        height: threeLinesHeight + 'px',
        width: config.width * getWidth('a', config)
      }}>
        <div 
          className="words" 
          onClick={() => inputRef.current?.focus()}
          style={{ transform: `translateY(0px)`}}
        >
          {drawingLines.map(([text, typed]) => 
            text && <Line
              key={text}
              text={text} 
              typed={typed}
            />
          )}
          <Caret position={caret} focused={inputHasFocus} />
        </div>
      </div>
    </div>
  );
}

export default TypingTest;
