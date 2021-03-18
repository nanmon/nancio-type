import React from 'react';

function TypingText({ typed, text, maxWidth, onType }) {
  const typedWords = typed.split(' ').filter(w => w);
  let line = []
  const renderedWords = text.split(' ').map((word, index) => {
    line.push(word);
    const width = getTextWidth(line.join(' '));
    const props = {};
    if (width > maxWidth - 150) {
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
  return (
    <>
      <input value={typed} onChange={onType}/>
      <svg width={maxWidth} height="600">
        <text fontFamily="monospace" fontSize="24" y="100">
          {fillBetween(renderedWords, () => <tspan>{" "}</tspan>)}
        </text>
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