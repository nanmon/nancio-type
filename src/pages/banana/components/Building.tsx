import * as formatters from '../util/formatters';
import '../styles/Building.css';

const KEYBINDS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
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
      <p>b-{formatters.sixDigits(building.price)}</p>
      <p>bps+{formatters.sixDigits(building.bps)}</p>
    </button>
  );
}

Building.KEYBINDS = KEYBINDS;

export default Building;