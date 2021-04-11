import * as formatters from '../util/formatters';
import '../styles/Building.css';

interface Props {
  state: Banana.State;
  building: Banana.Building;
  onBuy(id: number): void;
}

function Building({ state, building, onBuy }: Props) {
  return (
    <button
      className="Building"
      disabled={state.bananas < building.price} 
      onClick={() => onBuy(building.id)}
    >
      <h2>{building.owned}</h2>
      <h4>{building.name}</h4>
      <p>b-{formatters.sixDigits(building.price)}</p>
      <p>bps+{formatters.sixDigits(building.bps)}</p>
    </button>
  );
}

export default Building;