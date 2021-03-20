import React from 'react';
import './App.css';
import Typer from './components/Typer';
import { TyperProvider } from './components/StateProvider';
const { quotes } = require('./quotes.json')

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TyperProvider firstContent={randomQuote}>
          <Typer nextContent={randomQuote}/>
        </TyperProvider>
      </header>
    </div>
  );
}

export default App;


function randomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index]
}