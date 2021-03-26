import React from 'react';
import { clamp, fillBetween, last, tuplify } from '../util/std';
import { 
  getChars, 
  getExtra, 
  getTextWidth, 
  withExtra, 
  getWords 
} from '../util/text'
import { useTyper } from './Typer'

function TypingText({ onType }) {
  const { content, typed, config } = useTyper();

  const inputRef = React.useRef();
  const [inputHasFocus, setInputFocus] = React.useState(false);
  const [capslock, setCapslock] = React.useState(false);

  React.useEffect(() => {
    inputRef.current.focus();
  }, [content.text]);

  const lines = React.useMemo(() => {
    function wordsToLineToken(wordTokens) {
      return {
        text: wordTokens.map(w => w.text).join(' '),
        typed: wordTokens
          .map(w => w.typed)
          .filter(w => w)
          .join(' '),
      }
    }

    const lines = [];
    let currentLine = [];
    tuplify(
      getWords(content.text),
      getWords(typed),
    ).forEach(([woriginal, wtyped]) => {
      const wordToken = {
        text: woriginal,
        typed: wtyped,
      }
      currentLine.push(wordToken);
      const lineStr = currentLine
        .map(w => w.text + getExtra(w.text, w.typed))
        .join(' ');
      const width = getTextWidth(lineStr, config);
      if (width > config.width) {
        currentLine.pop();
        lines.push(wordsToLineToken(currentLine));
        currentLine = [wordToken];
      }
    });
    lines.push(wordsToLineToken(currentLine));
    return lines;
  }, [content.text, typed, config]);

  const caret = React.useMemo(() => {
    let index = lines.findIndex(line => !line.typed) - 1;
    if (index === -1) {
      // not started typing
      return { line: 0, x: 0};
    }
    if (index === -2) {
      // all lines have text
      index = lines.length - 1;
    }
    const lastTypedLine = lines[index];
    const typedWords = getWords(lastTypedLine.typed);
    const textWords = getWords(lastTypedLine.text);
    if (typedWords.length === textWords.length) {
      // completed this line but not started the next one
      if (typed.endsWith(' ')) return { line: index + 1, x: 0}
    }
    let textUntilCaret = withExtra(
      textWords.slice(0, typedWords.length - 1).join(' '), 
      typedWords.slice(0, typedWords.length - 1).join(' ')
    );
    if (textUntilCaret) textUntilCaret += ' ';
    if (typed.endsWith(' ')) {
      const wtext = textWords[typedWords.length - 1];
      textUntilCaret += wtext
        + getExtra(wtext, last(typedWords))
        + ' ';
    } else textUntilCaret += last(typedWords);
    return { line: index, x: getTextWidth(textUntilCaret, config) };
  }, [lines, config, typed]);

  function onKeyPress(e) {
    const prevent = onType(e);
    if (prevent) e.preventDefault();
    setCapslock(e.getModifierState('CapsLock'))
  }

  function capslockDetector(e) {
    setCapslock(e.getModifierState('CapsLock'))
  }

  const textY = React.useMemo(() => {
    const clamper = clamp(-1e20, 0);
    const offset = config.lineHeight - config.fontSize;
    return clamper(-(caret.line - 1) * config.lineHeight) - offset;
  }, [config, caret]);

  return (
    <>
      <input 
        ref={inputRef}
        onKeyDown={onKeyPress}
        onKeyUp={capslockDetector}
        style={{height: 0, padding: 0, border: 0}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      {capslock && <p>CAPSLOCK IS ACTIVE</p>}
      <svg width={config.width} height={config.lineHeight * 3} onClick={() => inputRef.current.focus()}>
        <text fontFamily={config.font} fontSize={config.fontSize} y={textY}>
          {lines.map((line, index) => 
            <Line 
              key={index} 
              lineHeight={config.lineHeight}
              isCurrent={caret.line === index}
              {...line}
            />
          )}
        </text>
        {inputHasFocus && <Caret {...caret}/>}
      </svg>
    </>
  )
}

export default TypingText;

const addSpaces = fillBetween((_b, _a, index) => <tspan key={'space-'+index}>{" "}</tspan>);
function Line({ text, typed, lineHeight, isCurrent }) {
  const typedWords = getWords(typed);
  const _words = tuplify(
    getWords(text),
   typedWords,
  ).map(([text, typed]) => ({text, typed}));
  const lastWordIndex = isCurrent ? typedWords.length - 1 : -1;
  return (
    <tspan className="line" dy={lineHeight} x={0}>
      {addSpaces(_words.map((word, index) => 
        <Word 
          key={index} 
          isCurrent={lastWordIndex === index}
          {...word}
        />
      ))}
    </tspan>
  );
}


function Word({ text, typed, isCurrent }) {
  const _chars = tuplify(
    getChars(text),
    getChars(typed)
  ).map(([text, typed]) => ({ text, typed }));
  const extraStr = getExtra(text, typed);
  getChars(extraStr).forEach(char => {
    _chars.push({ typed: char });
  });
  const redline = !isCurrent && typed && text !== typed;
  return (
    <tspan className="Word" textDecoration={redline ? 'underline solid red' : null} fill="red">
      {_chars.map((char, index) => <Char key={index} {...char}/>)}
    </tspan>
  );
}

function Char({ text, typed }) {
  const { config } = useTyper();
  const color = React.useMemo(() => {
    let code;
    if (!typed) code = 'left';
    else if (!text) code = 'extra';
    else if (typed === text) code = 'correct';
    else code = 'wrong';
    return config.colors[code]
  }, [text, typed, config]);
  const str = text || typed;
  return (
    <tspan className="Char" fill={color}>{str}</tspan>
  );
}

function Caret({ line, x }) {
  const { config, typed } = useTyper();
  const [className, setClassName] = React.useState('caret');

  React.useEffect(() => {
    setClassName('caret');
    const timeoutId = setTimeout(() => {
      setClassName('caret animated');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [typed]);

  const y = React.useMemo(() => {
    const offset = config.lineHeight - config.fontSize;
    const clamper = clamp(config.lineHeight, config.lineHeight * 2);
    return clamper((line + 1) * config.lineHeight) - offset;
  }, [line, config]);

  return (
    <text 
      className={className}
      fontFamily={config.font}
      fontSize={config.fontSize} 
      transform={`translate(${x}, ${y})`}
    >
      <tspan y="0" x={-6} fill={config.colors.caret}>|</tspan>
    </text>
  );
} 
