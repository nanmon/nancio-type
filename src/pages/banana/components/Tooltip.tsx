import '../styles/Tooltip.css';

interface GeneralProps {
  state: Banana.State
  position: [number, number]
}

interface BuildingProps {
  building: Banana.Building;
}

interface UpgradeProps {
  upgrade: Banana.Upgrade;
}

type Props = BuildingProps | UpgradeProps;

function Tooltip(props: Props & GeneralProps) {
  const { state, position } = props;
  let children: React.ReactNode;
  if (hasBuilding(props)) {
    // const { building } = props;
    children = '...';
  } else {
    const { upgrade } = props;
    children = upgrade.effects.map(e => {
      const describer = effectDescribers[e.type] as Describer;
      return describer(state, e);
    });
  }
  return (
    <div className="Tooltip" style={{
      left: position[0], 
      top: position[1] - 20
    }}>
      {children}
    </div>
  );
}

export default Tooltip;

function hasBuilding(props: Props): props is BuildingProps {
  return (props as BuildingProps).building !== undefined;
}

type Describer = (state: Banana.State, effect: Banana.Effects.Any) => string;
const effectDescribers = {
  efficiency(state: Banana.State, effect: Banana.Effects.Efficiency) {
    if (effect.buildingId === 0) {
      return `typewriters and typer efficiency x${effect.multiplier}`
    }
    const building = state.buildings[effect.buildingId];
    return `${building.name}s efficiency x${effect.multiplier}`;
  },
  gain(state: Banana.State, effect: Banana.Effects.Gain) {
    const gain = effect.gainType === 'add'
      ? `gain +${effect.gain}`
      : `gain ${effect.gain}x more`
    if (effect.buildingId === 0) {
      return `typewriters and typer ${gain} from other buildings`
    }
    const building = state.buildings[effect.buildingId];
    return `${building.name}s ${gain} from other buildings`;
  },
  typing(state: Banana.State, effect: Banana.Effects.Typing) {
    return `typing gains ${effect.cpsPercent}% of bps`
  },
  bpsMultiplier(state: Banana.State, effect: Banana.Effects.BpsMultiplier) {
    return `bps +${effect.bonus * 100}%`;
  }
}