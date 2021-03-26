import React from 'react';
import { Typer } from '../../components/Typer';
const { quotes } = require('./quotes.json')

function Quotes() {
  const [quote, setQuote] = React.useState(randomQuote);

  const onType = React.useCallback(t => {
    // console.log(t);
  }, [])

  return (
    <>
      <Typer content={quote} onType={onType}/>
      <button onClick={() => setQuote(randomQuote())}>Next</button>
    </>
  );
}

export default Quotes;

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}