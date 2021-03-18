import React from 'react';
import './App.css';
import TypingCanvas from './components/TypingCanvas';
const { quotes } = require('./quotes.json')

function App() {
  const [quote, setQuote] = React.useState(randomQuote);
  return (
    <div className="App">
      <header className="App-header">
        <TypingCanvas 
          text={quote.text} 
          onComplete={() => setQuote(randomQuote())}
        />
      </header>
    </div>
  );
}

export default App;

function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}