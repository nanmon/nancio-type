import React from 'react';
import { Typer } from '../../components/Typer';
const { quotes } = require('./quotes.json')

function Quotes() {
  const [quote, setQuote] = React.useState(randomQuote);

  return (
    <>
      <Typer content={quote} />
      <button onClick={() => setQuote(randomQuote())}>Next</button>
    </>
  );
}

export default Quotes;

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}