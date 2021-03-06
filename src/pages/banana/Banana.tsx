import React from 'react';
import randomWords from 'random-words';
import last from 'lodash/last';
import sum from 'lodash/sum';
import { lastWpm, mistypedLast, Typer } from '../../components/Typer';
import { getLines, IGNORED_CHARACTERS } from '../../util/text';
import * as formatters from './util/formatters';
import useBanana from './reducer';
import Building from './components/Building';
import Upgrade from './components/Upgrade';
import './styles/Banana.css';
import { fullBps, fullBpt } from './util/logic';

const initialState = JSON.parse(localStorage.getItem('banana') || 'null');

function Banana() {
  const [typed, setTyped] = React.useState('');
  const [content, setContent] = React.useState(() => getContent());
  const [state, dispatch] = useBanana(initialState);
  const [wps, setWps] = React.useState(0);
  const stateRef = React.useRef<Typer.State | null>(null);
  const [savedAt, setSavedAt] = React.useState(Date.now());
  const [ctrlHeld, setCtrlHeld] = React.useState(false);

  const availableBuildings = React.useMemo(() => {
    return state.buildings
      .filter(u => u.unlocked)
  }, [state.buildings]);

  const availableUpgrades = React.useMemo(() => {
    return state.upgrades
      .filter(u => u.unlocked && !u.bought)
      .sort((a, b) => a.price - b.price);
  }, [state.upgrades]);
  const shownBps = React.useMemo(() => {
    return fullBps(state);
  }, [state]);

  const shownBpt = React.useMemo(() => {
    return wps * 5 * fullBpt(state);
  }, [wps, state]);


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
    setCtrlHeld(direction === 'down' || e.key !== 'Control');
    if (direction === 'down') return false;
    let keyIndex = Building.KEYBINDS.indexOf(e.key);
    if (keyIndex !== -1) {
      const building = state.buildings[keyIndex];
      if (!building) return true;
      buyBuilding(building.id);
      return true;
    }
    keyIndex = Upgrade.KEYBINDS.indexOf(e.key);
    if (keyIndex !== -1) {
      const upgrade = availableUpgrades[keyIndex];
      if (!upgrade) return false;
      buyUpgrade(upgrade);
      return true;
    }
    return false;
  }

  function buyBuilding(id: number) {
    dispatch({ type: 'buyBuilding', buildingId: id });
  }

  function buyUpgrade(upgrade: Banana.Upgrade) {
    dispatch({ type: 'buyUpgrade', upgradeId: upgrade.id });
  }

  function renderBuildingsRow() {
    return (
      <div className="top-row">
        {availableBuildings.map(building =>
          <Building
            key={building.id}
            state={state}
            building={building}
            onBuy={buyBuilding}
            ctrlHeld={ctrlHeld}
          /> 
        )}
        {Building.KEYBINDS
          .slice(availableBuildings.length)
          .map(key =>
            <button key={key} className="key" disabled>
              <h3>{key}</h3>
            </button>
          )
        }
      </div>
    );
  }

  function renderUpgradesRow(index: number) {
    const order = ['home', 'bottom'];
    const lengths = [9, 7];
    const start = sum(lengths.slice(0, index));
    const end = sum(lengths.slice(0, index + 1));
    const upgrades = availableUpgrades.slice(start, end);
    return (
      <div className={`${order[index]}-row`}>
        {upgrades.map((upgrade, index) =>
          <Upgrade
            key={upgrade.id}
            state={state}
            upgrade={upgrade}
            index={start + index}
            ctrlHeld={ctrlHeld}
            onBuy={buyUpgrade}
          />
        )}
        {Upgrade.KEYBINDS
          .slice(start + upgrades.length, end)
          .map(key =>
            <button key={key} className="key" disabled>
              <h3>{key}</h3>
            </button>
          )
        }
      </div>
    )
  }

  const kbClasses = ['keyboard', ctrlHeld && 'quick-shop']
    .filter(c => c)
    .join(' ');

  return (
    <div className="Banana">
      <p>bananas: {formatters.totalBananas(state.bananas)}</p>
      <p>bps: {formatters.bps(shownBps)} + {formatters.bps(shownBpt)}({formatters.wpm(wps * 60)} wpm)</p>
      <Typer
        typed={typed}
        content={content} 
        onType={onType} 
        onKeyPress={onKeyPress}
        restartOnContentChange={false}
      />
      <div className={kbClasses}>
        {renderBuildingsRow()}
        {renderUpgradesRow(0)}
        {renderUpgradesRow(1)}
      </div>
      {!ctrlHeld && availableBuildings.length > 0 && 
        <p className="shop-sign">hold ctrl to access shop</p>
      }
    </div>
  )
}

export default Banana;

function getContent() {
  return {
    text: randomWords({ exactly: 100, join: ' ' })
  }
}