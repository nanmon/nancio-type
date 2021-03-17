import './App.css';
import TypingCanvas from './components/TypingCanvas';
const { quotes } = require('./quotes.json')

function App() {
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  return (
    <div className="App">
      <header className="App-header">
        <TypingCanvas text={quote.text}/>
      </header>
    </div>
  );
}

export default App;
