function init(
  state: Banana.State | null, 
  action: Banana.Actions.Init
): Banana.State {
  return {
    bananas: 0,
    bps: 0,
    bpt: 0.2,
    buildings: [
      {
        id: 0,
        name: 'typewritter',
        bps: 0.1,
        price: 15,
        keybind: '1',
        owned: 0
      }, 
      {
        id: 1,
        name: 'monke',
        bps: 1,
        price: 100,
        keybind: '2',
        owned: 0
      },
      {
        id: 2,
        name: 'bot',
        bps: 8,
        price: 1_100,
        keybind: '3',
        owned: 0
      },
      {
        id: 3,
        name: 'server',
        bps: 47,
        price: 12_000,
        keybind: '4',
        owned: 0
      },
      {
        id: 4,
        name: 'crytypomine',
        bps: 260,
        price: 130_000,
        keybind: '5',
        owned: 0
      },
      {
        id: 5,
        name: 'bank',
        bps: 1_400,
        price: 1_400_000,
        keybind: '6',
        owned: 0
      },
      {
        id: 6,
        name: 'temple',
        bps: 7_800,
        price: 20_000_000,
        keybind: '7',
        owned: 0
      },
      {
        id: 7,
        name: 'wizard tower',
        bps: 44_000,
        price: 330_000_000,
        keybind: '8',
        owned: 0
      },
      {
        id: 8,
        name: 'shipment',
        bps: 260_000,
        price: 5_100_000_000,
        keybind: '9',
        owned: 0
      },
      {
        id: 9,
        name: 'alchemy lab',
        bps: 1_600_000,
        price: 75_000_000_000,
        keybind: '0',
        owned: 0
      },
    ],
    tech: {
      lastTimestamp: action.timestamp
    },
    config: {}
  }
}

export default init;