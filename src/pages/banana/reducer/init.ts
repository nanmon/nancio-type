function init(
  state: Banana.State | null, 
  action: Banana.Actions.Init
): Banana.State {
  if (action.load) return state!;
  return {
    bananas: 0,
    bps: 0,
    bpt: 1,
    typerGain: 0,
    buildings: [
      building(0, 'typewriter', 0.1, 15), 
      building(1, 'monke', 1, 100),
      building(2, 'bot', 8, 1_100),
      building(3, 'server', 47, 12_000),
      building(4, 'crtypomine', 260, 130_000),
      building(5, 'bank', 1_400, 1.4e6),
      building(6, 'temple', 7_800, 20e6),
      building(7, 'wizard tower', 44_000, 330e6),
      building(8, 'shipment', 260_000, 5.1e9),
      building(9, 'alchemy lab', 1.6e6, 75e9),
      // building(10, 'portal', 10e6, 1e12),
      // building(11, 'time machine', 65e6, 14e12),
      // building(12, 'antimatter', 430e6, 170e12),
      // building(13, 'prism', 2.9e9, 2.1e15),
      // building(14, 'chancemaker', 21e9, 26e15),
      // building(15, 'fractal', 150e9, 310e15),
      // building(16, 'jconsole', 1.1e12, 71e18),
      // building(17, 'idleverse', 8.3e12, 12e21)
    ],
    upgrades: [
      doubleEfficiencyUpgrade(0, 'typing lessons', 100, 0, 1),
      doubleEfficiencyUpgrade(1, 'carpal tunneling', 500, 0, 1),
      doubleEfficiencyUpgrade(2, 'ten fingers', 10_000, 0, 10),
      buildingGainUpgrade(3, 'thousand fingers', 100_000, 0, 25, 'add', 0.1),
      buildingGainUpgrade(4, 'million fingers', 10_000_000, 0, 50, 'multiply', 5),
      buildingGainUpgrade(5, 'billion fingers', 100_000_000, 0, 100, 'multiply', 10),
      buildingGainUpgrade(6, 'trillion fingers', 1_000_000_000, 0, 150, 'multiply', 20)
    ],
    tech: {
      lastTimestamp: action.timestamp
    },
    config: {}
  }
}

export default init;

function building(
  id: number,
  name: string,
  bps: number,
  price: number,
): Banana.Building {
  return {
    id,
    name,
    bps,
    price,
    owned: 0
  };
}

function upgrade(
  id: number,
  name: string,
  price: number,
  lock: Banana.Locks.Any,
  ...effects: Banana.Effects.Any[]
): Banana.Upgrade {
  return {
    id,
    name,
    price,
    unlocked: false,
    bought: false,
    lock,
    effects
  }
}

function doubleEfficiencyUpgrade(
  id: number,
  name: string,
  price: number,
  buildingId: number,
  needed: number,
): Banana.Upgrade {
  return upgrade(id, name, price, {
    type: 'building',
    buildingId,
    needed
  }, {
    type: 'efficiency',
    buildingId,
    multiplier: 2
  });
}

function buildingGainUpgrade(
  id: number,
  name: string,
  price: number,
  buildingId: number,
  needed: number,
  gainType: 'add' | 'multiply',
  gain: number,
): Banana.Upgrade {
  return upgrade(id, name, price, {
    type: 'building',
    buildingId,
    needed
  }, {
    type: 'gain',
    buildingId,
    gainType,
    gain
  });
}
