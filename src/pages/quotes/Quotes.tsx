import React from 'react';
import { Typer } from '../../components/Typer';

const QUOTES_URL = process.env.REACT_APP_QUOTES_URL!;

function Quotes() {
  const [quotes, setQuotes] = React.useState<Typer.Content[]>([]);
  const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    fetch(QUOTES_URL)
      .then(r => r.json())
      .then(({ quotes }) => {
        setQuotes(quotes);
        setIndex(rand(quotes.length));
      });
  }, [])

  const onType = React.useCallback(t => {
    // console.log(t);
  }, []);

  if (index === -1) return <div>Loading...</div>;

  return (
    <>
      <Typer content={quotes[index]} onType={onType}/>
      <button onClick={() => setIndex(rand(quotes.length))}>Next</button>
    </>
  );
}

export default Quotes;


function rand(count: number) {
  return Math.floor(Math.random() * count);
}