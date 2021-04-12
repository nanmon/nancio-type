import * as formatters from '../util/formatters';
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
  const keybind = KEYBINDS[index];
  return (
    <button
      className="Upgrade"
      disabled={state.bananas < upgrade.price} 
      onClick={() => onBuy(upgrade)}
    >
      <h2>{keybind}</h2>
      <h4>{upgrade.name}</h4>
      <p>b-{formatters.price(upgrade.price)}</p>
    </button>
  );
}

Upgrade.KEYBINDS = KEYBINDS;

export default Upgrade;