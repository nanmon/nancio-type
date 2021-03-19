
import React from 'react';
import TypingText from './TypingText';
const { quotes } = require('../quotes.json')

const WIDTH = 1000

function Typer() {
  const [quote, setQuote] = React.useState(randomQuote);
  const [typed, setTyped] = React.useState('');
  const [stats, statsDispatch] = React.useReducer(statsReducer, statsInit());
  const [showStats, setShowStats] = React.useState(false)

  const { text } = quote;

  React.useEffect(() => {
    if (doneTyping(typed, text)) {
      setShowStats(true);
      setTyped('');
    }
  }, [typed, text])

  React.useEffect(() => {
    if (showStats) return;
    const intervalId = setInterval(() => {
      statsDispatch({ type: 'interval', delta: 1 });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [showStats]);
  
  function onType(e) {
    const { value } = e.target;
    setTyped(value);

    statsDispatch({ type: 'typing', typed: value, text });
  }

  function onNext() {
    setQuote(randomQuote());
    setShowStats(false);
    statsDispatch({ type: 'restart'})
  }

  return (
    <>
      {showStats 
        ? <Stats stats={stats} onNext={onNext}/>
        : <TypingText 
            typed={typed} 
            text={text} 
            maxWidth={WIDTH}
            onType={onType}
          />
      }
      <button onClick={onNext}>Next</button>
    </>
  );
}

export default Typer;

function Stats({ stats, onNext }) {
  return (
    <>
      <p>Avg: {avg(stats.wpm)} wpm</p>
      <p>Time: {stats.wpm.length}s </p>
      <p>Errors: {stats.errors}</p>
    </>
  )
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

function statsInit() {
  return {
    count: 0, prevCount: 0, wpm: [], errors: 0
  }
}

function statsReducer(state, action) {
  switch(action.type) {
    case 'typing':
      return {  
        ...state,
        count: state.count + 1,
        errors: state.errors + Number(didErr(action))
      }
    case 'interval':
      if (state.count === 0) return state;
      const k = action.delta / 60 * 5; //transform to wpm
      return {
        ...state,
        prevCount: state.count,
        wpm: [
          ...state.wpm,
          (state.count - state.prevCount) / k
        ]
      }
    case 'restart': return statsInit();
    default: return state;
  }
}

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}

function last(array) {
  return array[array.length - 1];
}

function avg(array) {
  return array.reduce((s, v) => s + v, 0) / array.length;
}

function didErr({ typed, text }) {
  if (typed.endsWith(' ')) return false;
  const wordsTyped = typed.split(' ');
  const lastWord = wordsTyped[wordsTyped.length - 1];
  const actualWord = text.split(' ')[wordsTyped.length - 1];
  return actualWord && actualWord[lastWord.length - 1] !== lastWord[lastWord.length - 1];
}