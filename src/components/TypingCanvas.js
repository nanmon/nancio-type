import React from 'react';

const WIDTH = 1000

function TypingCanvas({ text, onComplete }) {
  const [wordIndex, setWordIndex] = React.useState(0);
  const [typed, setTyped] = React.useState('')

  React.useEffect(() => {
    if (typed === text) {
      onComplete();
      setTyped('');
    }
  }, [typed, text, onComplete])
  
  function onType(e) {
    setTyped(e.target.value)
  }
  
  function renderChar(typed, char) {
    let color;
    if (!typed) color = 'grey';
    else if (typed === char) color = 'white';
    else color = 'red';
    return <tspan fill={color}>{char}</tspan>;
  }

  function renderWord(typed = '', word) {
    let chars = word.split('');
    let rendered = [];
    chars.forEach((char, index) => {
      rendered.push(renderChar(typed[index], char));
    }, '')
    if (typed.length > word.length) {
      chars = typed.substr(word.length).split('');
      chars.forEach(char => {
        rendered.push(<tspan fill="darkred">{char}</tspan>);
      })
    }
    return rendered;
  }
  
  function renderText() {
    const typedWords = typed.split(' ').filter(w => w);
    let line = []
    const renderedWords = text.split(' ').map((word, index) => {
      line.push(word);
      const width = getTextWidth(line.join(' '));
      const props = {};
      if (width > WIDTH - 100) {
        props.x = '0';
        props.dy="1.2em"
        line = [];
      }
      return <tspan {...props}>{renderWord(typedWords[index], word)}</tspan>;
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