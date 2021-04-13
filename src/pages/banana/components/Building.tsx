import * as formatters from '../util/formatters';
import '../styles/Building.css';
import { buildingBpsPerOwned } from '../util/logic';

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
  if (ctrlHeld) {
    return (
      <button
        className="Building key quick-shop"
        disabled={state.bananas < building.price} 
        onClick={() => onBuy(building.id)}
      >
        <h2>{keybind}</h2>
        <h4>{building.owned} {building.name}</h4>
        <p>b-{formatters.price(building.price)}</p>
        <p>bps+{formatters.bps(buildingBpsPerOwned(state, building))}</p>
      </button>
    );
  }
  return (
    <button
        className="Building key quick-shop"
        disabled={state.bananas < building.price} 
        onClick={() => onBuy(building.id)}
      >
        <h2>{keybind}</h2>
        <h4>{building.owned}</h4>
      </button>
  );
}

Building.KEYBINDS = KEYBINDS;

export default Building;