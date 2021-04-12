import * as formatters from '../util/formatters';
import '../styles/Building.css';

const KEYBINDS = [
  'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
];

interface Props {
  state: Banana.State;
  building: Banana.Building;
  ctrlHeld: boolean;
  onBuy(id: number): void;
}

function Building({ state, building, ctrlHeld, onBuy }: Props) {
  const keybind = KEYBINDS[building.id];
  return (
    <button
      className="Building"
      disabled={state.bananas < building.price} 
      onClick={() => onBuy(building.id)}
    >
      <h2>{ctrlHeld ? keybind : building.owned}</h2>
      <h4>{building.name}</h4>
      <p>b-{formatters.price(building.price)}</p>
      <p>bps+{formatters.bps(building.bps)}</p>
    </button>
  );
}

Building.KEYBINDS = KEYBINDS;

export default Building;