function init(
  state: Banana.State | null, 
  action: Banana.Actions.Init
): Banana.State {
  if (action.load) return state!;
  return {
    bananas: 0,
    bps: 0,
    bpt: 1,
    buildings: [
      building(0, 'typewriter', 0.1, 15, '1'), 
      building(1, 'monke', 1, 100, '2'),
      building(2, 'bot', 8, 1_100, '3'),
      building(3, 'server', 47, 12_000, '4'),
      building(4, 'crtypomine', 260, 130_000, '5'),
      building(5, 'bank', 1_400, 1_400_000, '6'),
      building(6, 'temple', 7_800, 20_000_000, '7'),
      building(7, 'wizard tower', 44_000, 330_000_000, '8'),
      building(8, 'shipment', 260_000, 5_100_000_000, '9'),
      building(9, 'alchemy lab', 1_600_000, 75_000_000_000, '0'),
      building(10, 'portal', 10_000, 1_000_000_000_000, '-'),
      building(11, 'time machine', 65_000_000, 14_000_000_000_000, '='),
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
  keybind: string,
): Banana.Building {
  return {
    id,
    name,
    bps,
    price,
    keybind,
    owned: 0
  };
}

