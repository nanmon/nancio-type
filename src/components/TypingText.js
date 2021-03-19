import React from 'react';

function TypingText({ typed, text, maxWidth, onType }) {
  const typedWords = typed.split(' ').filter(w => w);
  const allWords = text.split(' ');

  const inputRef = React.useRef();
  const [inputHasFocus, setInputFocus] = React.useState(false);

  React.useEffect(() => {
    inputRef.current.focus();
  }, []);
  
  function drawWords() {
    let line = []
    const renderedWords = allWords.map((word, index) => {
      line.push(word);
      const width = getTextWidth(line.join(' '));
      const props = {};
      if (width > maxWidth) {
        props.x = '0';
        props.dy = "24"
        line = [word];
      }
      return (
        <tspan {...props}>
          <Word key={index} typed={typedWords[index]} word={word}/>
        </tspan>
      );
    });
    return fillBetween(renderedWords, () => <tspan>{" "}</tspan>);
  }

  function drawCaret() {
    let y = 24;
    let line = [];
    let width = 0; // will stay with last line width
    if (typedWords.length > 0) {
      allWords.slice(0, typedWords.length - 1)
      // .concat(typedWords.slice(typedWords.length - 1))
        .forEach(word => {
          line.push(word)
          width = getTextWidth(line.join(' '));
          if (width > maxWidth) {
            y += 24;
            line = [word];
          }
        });

      const lastTypedWord = typedWords[typedWords.length - 1];
      const lastTypedCompleteWord = allWords[typedWords.length - 1];

      const widthWithWholeWord = getTextWidth([...line, lastTypedCompleteWord].join(' '));

      if (widthWithWholeWord > maxWidth) {
        y += 24;
        line = []
      }
      line.push(lastTypedWord);
      width = getTextWidth(line.join(' ') + (typed.endsWith(' ') ? ' ' : ''));
    }
    return (
      <text 
        className="caret" 
        fontFamily="monospace" 
        fontSize="24" 
        transform={`translate(${width}, ${y})`}
      >
        <tspan y="0" x={-6}  fill="cyan">|</tspan>
      </text>
    );
  }

  return (
    <>
      <input 
        ref={inputRef}
        value={typed} 
        onChange={onType} 
        style={{height: 0, padding: 0, border: 0}}
        onFocus={() => setInputFocus(true)}
        onBlur={() => setInputFocus(false)}
      />
      <svg width={maxWidth} height="600" onClick={() => inputRef.current.focus()}>
        <text fontFamily="monospace" fontSize="24" y="24">
          {drawWords()}
        </text>
        {inputHasFocus && drawCaret()}
      </svg>
    </>
  )
}

export default TypingText;


function Word({ typed = '', word }) {

  let chars = word.split('');
  let rendered = [];
  chars.forEach((char, index) => {
    const typedChar = typed[index];
    let color;
    if (!typedChar) color = 'grey';
    else if (typedChar === char) color = 'white';
    else color = 'red';
    rendered.push(<tspan key={'char-'+index} fill={color}>{char}</tspan>);
  })
  if (typed.length > word.length) {
    chars = typed.substr(word.length).split('');
    chars.forEach((char, index) => {
      rendered.push(<tspan key={'extra-'+index} fill="darkred">{char}</tspan>);
    })
  }
  return rendered;
}

function fillBetween(array, fn) {
  const newArray = array.map(item => [item, fn(item)]).flat();
  newArray.pop();
  return newArray;
}

function getTextWidth(text, font = "500 24px monospace") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}

const log = o => console.log(o) || o;