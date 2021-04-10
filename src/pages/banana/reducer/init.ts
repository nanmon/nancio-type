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
      }
    ],
    tech: {
      lastTimestamp: action.timestamp
    },
    config: {}
  }
}

export default init;