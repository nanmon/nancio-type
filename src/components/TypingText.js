import React from 'react';
import { clamp, fillBetween, tuplify } from '../util/std';
import { chars, extra, getTextWidth, words } from '../util/text'
import { useTyper } from '../util/state'

function TypingText({ onType }) {
  const { content, typed, config } = useTyper();
  const meta = metadata(content.text, typed, config);

  const inputRef = React.useRef();
  const [inputHasFocus, setInputFocus] = React.useState(false);

  React.useEffect(() => {
    inputRef.current.focus();
  }, [content.text]);

  function onKeyPress(e) {
    const prevent = onType(e);
    if (prevent) e.preventDefault();
  }

  const textY = React.useMemo(() => {
    const clamper = clamp(-1e20, 0);
    return clamper(-(meta.caret.line - 1) * config.fontSize);
  }, [config, meta]);

  return (
    <>
      <input 
        ref={inputRef}
        onKeyDown={onKeyPress} 
        style={{height: 0, padding: 0, border: 0}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <svg width={config.width} height={config.fontSize * 3.25} onClick={() => inputRef.current.focus()}>
        <text fontFamily={config.font} fontSize={config.fontSize} y={textY}>
          {meta.lines.map((line, index) => <Line key={index} fontSize={config.fontSize} {...line}/>)}
        </text>
        {inputHasFocus && <Caret {...meta.caret}/>}
      </svg>
    </>
  )
}

export default TypingText;

const addSpaces = fillBetween((_b, _a, index) => <tspan key={'space-'+index}>{" "}</tspan>);
function Line({ words, fontSize }) {
  return (
    <tspan className="line" dy={fontSize} x={0}>
      {addSpaces(
        words.map((word, index) => <Word key={index} {...word}/>),
      )}
    </tspan>
  );
}


function Word({ chars }) {
  return (
    <tspan className="Word">
      {chars.map((char, index) => <Char key={index} {...char}/>)}
    </tspan>
  );
}

function Char({ code, str }) {
  const { config } = useTyper()
  const color = config.colors[code]
  return (
    <tspan className="Char" fill={color}>{str}</tspan>
  );
}

function Caret({ line, x }) {
  const { config } = useTyper();

  const y = React.useMemo(() => {
    const clamper = clamp(config.fontSize, config.fontSize * 2);
    return clamper((line + 1) * config.fontSize);
  }, [line, config]);

  return (
    <text 
      className="caret" 
      fontFamily={config.font}
      fontSize={config.fontSize} 
      transform={`translate(${x}, ${y})`}
    >
      <tspan y="0" x={-6} fill="cyan">|</tspan>
    </text>
  );
}

function metadata(text, typed, config) {
  const lines = [];
  let currentLine = [];
  let caret = { line: 0, x: 0 };
  tuplify(
    words(text),
    words(typed),
    words(typed).slice(1)
  ).forEach(([woriginal, wtyped, nextWtyped]) => {
    const wordMeta = wordMetadata(woriginal, wtyped);
    currentLine.push(wordMeta);
    const lineStr = currentLine.map(w => w.str).join(' ');
    const width = getTextWidth(lineStr, config);
    if (width > config.width) {
      currentLine.pop();
      lines.push({
        words: currentLine,
        str: currentLine.map(w => w.str).join(' ')
      });
      currentLine = [wordMeta];
    }

    if (wtyped && !nextWtyped) 
      caret = {
        x: caretMetadata(wtyped, currentLine, config, typed.endsWith(' ')),
        line: lines.length
      }
  });
  lines.push({
    words: currentLine,
    str: currentLine.map(w => w.str).join(' ')
  });
  return { lines, caret };
}

function wordMetadata(woriginal, wtyped) {
  let charsMeta = tuplify(
    chars(woriginal),
    chars(wtyped)
  ).map(([choriginal, chtyped]) => {
    const charMeta = {str: choriginal};
    if (!chtyped) charMeta.code = 'left';
    else if (chtyped === choriginal) charMeta.code = 'correct';
    else charMeta.code = 'wrong';
    return charMeta
  });
  const extraStr = extra(woriginal)(wtyped);
  chars(extraStr).forEach(char => {
    charsMeta.push({ str: char, code: 'extra '});
  });
  return { str: woriginal + extraStr, chars: charsMeta };
}

function caretMetadata(wtyped, currentLine, config, endsWithSpace) {
  const lineUntilCaret = currentLine.slice(0, currentLine.length - 1);
  let lineStr = lineUntilCaret.map(w => w.str).join(' ');
  if (lineStr) lineStr += ' ';
  lineStr += wtyped;
  if (endsWithSpace) lineStr += ' ';
  return getTextWidth(lineStr, config);
}