import React from 'react';
import randomWords from 'random-words';
import last from 'lodash/last';
import { lastWpm, mistypedLast, Typer } from '../../components/Typer';
import { getLines, IGNORED_CHARACTERS } from '../../util/text';
import * as formatters from './util/formatters';
import useBanana from './reducer';
import Building from './components/Building';
import './styles/Banana.css';

const initialState = JSON.parse(localStorage.getItem('banana') || 'null');

function Banana() {
  const [typed, setTyped] = React.useState('');
  const [content, setContent] = React.useState(() => getContent());
  const [state, dispatch] = useBanana(initialState);
  const [wps, setWps] = React.useState(0);
  const stateRef = React.useRef<Typer.State | null>(null);
  const [savedAt, setSavedAt] = React.useState(Date.now());
  const [ctrlHeld, setCtrlHeld] = React.useState(false);

  React.useEffect(() => {
    if (Date.now() - savedAt < 10_000) return;
    const json = JSON.stringify(state);
    localStorage.setItem('banana', json);
    setSavedAt(Date.now());
  }, [state, savedAt]);

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
    if (typed.length < 500) return;
    console.log('remove first lines')
    const lines = getLines(content.text, typed, stateRef.current!.config);
    lines.splice(0, 2); // remove first 2 lines
    setTyped(() => {
      let t = lines.map(([_, t]) => t).join(' ').trim();
      if (typed.endsWith(' ')) t += ' ';
      return t;
    });
    setContent(() => {
      let t = lines.map(([t]) => t).join(' ');
      t += ' ' + randomWords({ exactly: 50, join: ' '});
      return { text: t };
    });
  }, [typed, content]);

  function onType(state: Typer.State) {
    stateRef.current = state;
    setTyped(state.typed);
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

  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>, direction: 'up' | 'down') {
    if (!e.getModifierState('Control')) {
      setCtrlHeld(false);
      return false;
    }
    setCtrlHeld(direction === 'down');
    const building = state.buildings.find(b => {
      return e.key === b.keybind;
    });
    if (!building) return true;
    buyBuilding(building.id);
    return true;
  }

  function buyBuilding(id: number) {
    dispatch({ type: 'buyBuilding', buildingId: id });
  }

  return (
    <div className="Banana">
      <p>bananas: {formatters.threeDecimals.format(state.bananas)}</p>
      <p>bps: {formatters.threeDecimals.format(state.bps)} + {formatters.threeDecimals.format(wps * 5)}({formatters.wpm.format(wps * 60)} wpm)</p>
      <Typer
        typed={typed}
        content={content} 
        onType={onType} 
        onKeyPress={onKeyPress}
        restartOnContentChange={false}
      />
      {state.buildings.map(building =>
        <Building
          key={building.id}
          state={state}
          building={building}
          onBuy={buyBuilding}
          ctrlHeld={ctrlHeld}
        /> 
      )}
    </div>
  )
}

export default Banana;

function getContent() {
  return {
    text: randomWords({ exactly: 100, join: ' ' })
  }
}