import React from 'react';

const WIDTH = 1000

function TypingCanvas({ text, onComplete }) {
  const [typed, setTyped] = React.useState('')

  React.useEffect(() => {
    if (doneTyping(typed, text)) {
      onComplete();
      setTyped('');
    }
  }, [typed, text, onComplete])
  
  function onType(e) {
    setTyped(e.target.value)
  }
  
  function renderText() {
    const typedWords = typed.split(' ').filter(w => w);
    let line = []
    const renderedWords = text.split(' ').map((word, index) => {
      line.push(word);
      const width = getTextWidth(line.join(' '));
      const props = {};
      if (width > WIDTH - 200) {
        props.x = '0';
        props.dy="1.2em"
        line = [];
      }
      return (
        <tspan {...props}>
          <Word key={index} typed={typedWords[index]} word={word}/>
        </tspan>
      );
    });
    return fillBetween(renderedWords, () => <tspan>{" "}</tspan>);
  }

  return (
    <>
    <input value={typed} onChange={onType}/>
    <svg width={WIDTH} height="600">
      <text fontFamily="monospace" fontSize="24" y="100">
        {renderText()}
      </text>
    </svg>
    </>
  );
}

export default TypingCanvas;

function Word({ typed = '', word }) {

  let chars = word.split('');
  let rendered = [];
  chars.forEach((char, index) => {
    const typedChar = typed[index];
    let color;
    if (!typedChar) color = 'grey';
    else if (typedChar === char) color = 'white';
    else color = 'red';
    rendered.push(<tspan key={index} fill={color}>{char}</tspan>);
  })
  if (typed.length > word.length) {
    chars = typed.substr(word.length).split('');
    chars.forEach(char => {
      rendered.push(<tspan fill="darkred">{char}</tspan>);
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

function doneTyping(typed, text) {
  const typedWords = typed.split(' ').filter(w => w);
  const allWords = text.split(' ');
  if (typedWords.length < allWords.length) return false;
  if (typed.endsWith(' ')) return true;
  const lastTyped = typedWords.pop();
  const lastWord = allWords.pop();
  return lastTyped === lastWord;
}