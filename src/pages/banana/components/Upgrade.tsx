import React from 'react';
import * as formatters from '../util/formatters';
import Tooltip from './Tooltip';
import '../styles/Upgrade.css';

const KEYBINDS = [
  'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
  'z', 'x', 'c', 'v', 'b', 'n', 'm',
];

interface Props {
  state: Banana.State;
  upgrade: Banana.Upgrade;
  index: number;
  ctrlHeld: boolean;
  onBuy(upgrade: Banana.Upgrade): void;
}
function Upgrade({ state, upgrade, index, ctrlHeld, onBuy }: Props) {
  const [tooltip, setTooltip] = React.useState<[number, number] | null>(null);

  React.useEffect(() => {
    setTooltip(null);
  }, [ctrlHeld]);

  function hover({ clientX, clientY }: React.MouseEvent) {
    setTooltip([clientX, clientY])
  }

  const keybind = KEYBINDS[index];
  if (ctrlHeld) {
    return (
      <div
        className="Upgrade"
        onMouseMove={hover}
        onMouseEnter={hover}
        onMouseLeave={() => setTooltip(null)}
      >
        <button 
          className="key quick-shop" 
          disabled={state.bananas < upgrade.price}
          onClick={() => onBuy(upgrade)}
        >
          <h2>{keybind}</h2>
          <h4>{upgrade.name}</h4>
          <p>b-{formatters.price(upgrade.price)}</p>
        </button>
        {tooltip &&
          <Tooltip state={state} upgrade={upgrade} position={tooltip}/>
        }
      </div>
    );
  }
  return (
    <button
      className="Upgrade key"
      disabled={state.bananas < upgrade.price} 
      onClick={() => onBuy(upgrade)}
    >
      <h2>{keybind}</h2>
      <h4>o</h4>
    </button>
  );
}

Upgrade.KEYBINDS = KEYBINDS;

export default Upgrade;