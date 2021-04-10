import React from 'react';
import randomWords from 'random-words';
import last from 'lodash/last';
import { lastWpm, mistypedLast, Typer } from '../../components/Typer';
import { IGNORED_CHARACTERS } from '../../util/text';
import useBanana from './reducer';
import './Banana.css';

const bananaFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
  minimumFractionDigits: 3
});

const wpmFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
  maximumSignificantDigits: 3,
  minimumSignificantDigits: 3,
});

function Banana() {
  const [content, setContent] = React.useState(() => getContent());
  const [state, dispatch] = useBanana();
  const [wps, setWps] = React.useState(0);
  const stateRef = React.useRef<Typer.State | null>(null);

  React.useEffect(() => {
    const fps = 20;
    const intervalId = setInterval(() => {
      dispatch({ type: 'tick', timestamp: Date.now() });
    }, 1000 / fps);
    return () => clearInterval(intervalId);
  }, [dispatch]);

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

    if (IGNORED_CHARACTERS.includes(lastChar))
      dispatch({ type: 'typed', char: 'ignored' });
    else if (mistypedLast(state)) 
      dispatch({ type: 'typed', char: 'mistyped'});
    else
      dispatch({ type: 'typed', char: 'correct' });
  }

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!e.getModifierState('Control')) return false;
    if (e.key === '1') buyBuilding(0);
    if (e.key === '2') buyBuilding(1);
    return true;
  }

  function buyBuilding(id: number) {
    dispatch({ type: 'buyBuilding', buildingId: id });
  }

  return (
    <div className="Banana">
      <p>bananas: {bananaFormatter.format(state.bananas)}</p>
      <p>bps: {bananaFormatter.format(state.bps)} + {bananaFormatter.format(wps)}({wpmFormatter.format(wps * 60)} wpm)</p>
      <Typer content={content} onType={onType} onKeyPress={onKeyPress}/>
      {state.buildings.map(building =>
        <button 
          key={building.id}
          disabled={state.bananas < building.price} 
          onClick={() => buyBuilding(building.id)}
        >
          {building.owned} {building.name}s, press ctrl + {building.keybind} to buy one for {Math.round(building.price)} bananas
        </button>
      )}
    </div>
  )
}

export default Banana;

function getContent() {
  return {
    text: randomWords({ exactly: 200, join: ' ' })
  }
}