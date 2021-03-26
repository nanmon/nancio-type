import React from 'react';
import Typer from '../../components/Typer';
import { TyperProvider } from '../../components/StateProvider';
const { quotes } = require('./quotes.json')

function Quotes() {
  const [quote, setQuote] = React.useState(randomQuote);

  return (
    <TyperProvider content={quote}>
      <Typer onNext={() => setQuote(randomQuote())}/>
    </TyperProvider>
  );
}

export default Quotes;

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}