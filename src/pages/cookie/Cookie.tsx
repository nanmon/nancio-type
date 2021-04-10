import React from 'react';
import randomWords from 'random-words';
import last from 'lodash/last';
import { lastWpm, mistypedLast, Typer } from '../../components/Typer';
import { IGNORED_CHARACTERS } from '../../util/text';
import './Cookie.css';

const cookieFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3
});

const wpmFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  maximumSignificantDigits: 3,
  minimumSignificantDigits: 3,
});

function Cookie() {
  const [content, setContent] = React.useState(() => getContent());
  const [cookies, setCookies] = React.useState(0);
  const [typewritters, setTypewritters] = React.useState(0);
  const [monkeys, setMonkeys] = React.useState(0);
  const [wps, setWps] = React.useState(0);
  const stateRef = React.useRef<Typer.State | null>(null);


  const cps = React.useMemo(() => {
    return typewritters * 0.1 + monkeys;
  }, [typewritters, monkeys]);

  React.useEffect(() => {
    const fps = 20;
    const intervalId = setInterval(() => {
      setCookies(c => c + cps / fps);
    }, 1000 / fps);
    return () => clearInterval(intervalId);
  }, [cps]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      if (stateRef.current == null) return;
      const lastTime = last(stateRef.current.timeline);
      if (!lastTime) return;
      if (Date.now() - lastTime.timestamp > 1000) {
        return setWps(0);
      }
      const wpm = lastWpm(stateRef.current);
      setWps(wpm / 60);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setContent(getContent());
    }, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  function onType(state: Typer.State) {
    stateRef.current = state;
    const lastTime = last(state.timeline);
    if (!lastTime) return;
    const lastChar = lastTime.char;
    if (IGNORED_CHARACTERS.includes(lastChar)) return;
    if (mistypedLast(state)) return setCookies(c => c - 0.1);
    setCookies(c => c + 0.2);
  }

  const costs = {
    typewritter: Math.ceil(15 * (1.15 ** typewritters)),
    monkey: Math.ceil(100 * (1.15 ** monkeys))
  }

  function buyTypewritter() {
    const price = costs.typewritter;
    setCookies(c => c - price);
    setTypewritters(t => t + 1);
  }

  function buyMonkey() {
    const price = costs.monkey;
    setCookies(c => c - price);
    setMonkeys(m => m + 1);
  }

  return (
    <div className="Cookie">
      <p>bananas: {cookieFormatter.format(cookies)}</p>
      <p>bps: {cookieFormatter.format(cps)} + {cookieFormatter.format(wps)}({wpmFormatter.format(wps * 60)} wpm)</p>
      <Typer content={content} onType={onType}/>
      <button disabled={cookies < costs.typewritter} onClick={buyTypewritter}>
        {typewritters} typewritters, buy one for {costs.typewritter} bananas
      </button>
      <button disabled={cookies < costs.monkey} onClick={buyMonkey}>
        {monkeys} monkes, buy one for {costs.monkey} bananas
      </button>
    </div>
  )
}

export default Cookie;

function getContent() {
  return {
    text: randomWords({ exactly: 200, join: ' ' })
  }
}