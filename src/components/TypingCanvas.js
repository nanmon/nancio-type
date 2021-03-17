import React from 'react';

function TypingCanvas({ text }) {
  const [typed, setTyped] = React.useState('')
  
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
    const renderedWords = text.split(' ').map((word, index) => {
      const props = {};
      if (index % 5 === 0) {
        props.x = '0';
        props.dy="1.2em"
      }
      return <tspan {...props}>{renderWord(typedWords[index], word)}</tspan>;
    });
    return fillBetween(renderedWords, () => <tspan>{" "}</tspan>);
  }

  return (
    <>
    <input value={typed} onChange={onType}/>
    <svg width="500" height="600">
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