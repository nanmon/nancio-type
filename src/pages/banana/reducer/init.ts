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
      building(7, 'spaceship', 44_000, 330e6),
      building(8, 'portal', 260_000, 5.1e9),
      building(9, 'time machine', 1.6e6, 75e9),
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
      // typewritter
      doubleEfficiencyUpgrade(0, 'typing lessons', 100, 0, 1),
      doubleEfficiencyUpgrade(1, 'carpal tunneling', 500, 0, 1),
      doubleEfficiencyUpgrade(2, 'ten fingers', 10_000, 0, 10),
      buildingGainUpgrade(3, 'thousand fingers', 100_000, 0, 25, 'add', 0.1),
      buildingGainUpgrade(4, 'million fingers', 10e6, 0, 50, 'multiply', 5),
      buildingGainUpgrade(5, 'billion fingers', 100e6, 0, 100, 'multiply', 10),
      buildingGainUpgrade(6, 'trillion fingers', 1e9, 0, 150, 'multiply', 20),
      buildingGainUpgrade(7, 'quadrillion fingers', 10e9, 0, 200, 'multiply', 20),
      buildingGainUpgrade(8, 'quintillion fingers', 10e12, 0, 250, 'multiply', 20),
      // monke
      doubleEfficiencyUpgrade(9, 'monketype.com', 1_000, 1, 1),
      doubleEfficiencyUpgrade(10, 'monke flip', 5_000, 1, 5),
      doubleEfficiencyUpgrade(11, 'genes enhancer', 50_000, 1, 25),
      doubleEfficiencyUpgrade(12, 'monke planet', 5e6, 1, 50),
      doubleEfficiencyUpgrade(13, 'king kong', 500e6, 1, 100),
      doubleEfficiencyUpgrade(14, 'monke rap', 50e9, 1, 150),
      doubleEfficiencyUpgrade(15, 'dk!', 50e12, 1, 200),
      doubleEfficiencyUpgrade(16, 'donkey kong!', 50e15, 1, 250),
      // bot
      doubleEfficiencyUpgrade(17, 'beep', 11_000, 2, 1),
      doubleEfficiencyUpgrade(18, 'boop', 55_000, 2, 5),
      doubleEfficiencyUpgrade(19, 'deep learning', 550_000, 2, 25),
      doubleEfficiencyUpgrade(20, 'ai overturn', 55e6, 2, 50),
      doubleEfficiencyUpgrade(21, 'george', 5.5e9, 2, 100),
      doubleEfficiencyUpgrade(22, 'deep fake', 550e9, 2, 150),
      doubleEfficiencyUpgrade(23, 'deep typing', 550e12, 2, 200),
      doubleEfficiencyUpgrade(24, 'i, monke', 550e15, 2, 250),
      // server
      doubleEfficiencyUpgrade(25, 'discord', 120_000, 3, 1),
      doubleEfficiencyUpgrade(26, '1st boost', 600_000, 3, 5),
      doubleEfficiencyUpgrade(27, 'challenges', 6e6, 3, 25),
      doubleEfficiencyUpgrade(28, 'wpm roles', 600e6, 3, 50),
      doubleEfficiencyUpgrade(29, 'streams', 60e9, 3, 100),
      doubleEfficiencyUpgrade(30, '10k members', 6e12, 3, 150),
      doubleEfficiencyUpgrade(31, 'boost lvl 3', 6e15, 3, 200),
      doubleEfficiencyUpgrade(32, 'secret server', 6e18, 3, 250),
      // crtypomine
      doubleEfficiencyUpgrade(33, 'autocorrect', 1.3e6, 4, 1),
      doubleEfficiencyUpgrade(34, 'typocurrency', 6.5e6, 4, 5),
      doubleEfficiencyUpgrade(35, 'tpu farm', 65e6, 4, 25),
      doubleEfficiencyUpgrade(36, '69 MH/s', 6.5e9, 4, 50),
      doubleEfficiencyUpgrade(37, '420 MH/s', 650e9, 4, 100),
      doubleEfficiencyUpgrade(38, 'tpu shortage', 65e12, 4, 150),
      doubleEfficiencyUpgrade(39, 'wall street crash', 65e15, 4, 200),
      doubleEfficiencyUpgrade(40, 'codvi19 vaccine', 65e18, 4, 250),
      // bank
      doubleEfficiencyUpgrade(41, 'taller tellers', 14e6, 5, 1),
      doubleEfficiencyUpgrade(42, 'titanium cards', 70e6, 5, 5),
      doubleEfficiencyUpgrade(43, 'antiacid vaults', 700e6, 5, 25),
      doubleEfficiencyUpgrade(44, 'banana coins', 70e9, 5, 50),
      doubleEfficiencyUpgrade(45, 'exp. interests', 7e12, 5, 100),
      doubleEfficiencyUpgrade(46, 'financial zen', 700e12, 5, 150),
      doubleEfficiencyUpgrade(47, 'wallet way', 700e15, 5, 200),
      doubleEfficiencyUpgrade(48, 'rationale stuffed', 700e18, 5, 250),
      // temple
      doubleEfficiencyUpgrade(49, 'golden idols', 200e6, 6, 1),
      doubleEfficiencyUpgrade(50, 'sacrifices', 1e9, 6, 1),
      doubleEfficiencyUpgrade(51, 'blessed fingers', 10e9, 6, 25),
      doubleEfficiencyUpgrade(52, 'monkegod festival', 1e12, 6, 50),
      doubleEfficiencyUpgrade(53, 'enlarged pantheon', 100e12, 6, 100),
      doubleEfficiencyUpgrade(54, 'bowser in the sky', 10e15, 6, 150),
      doubleEfficiencyUpgrade(55, 'creation myth', 10e18, 6, 200),
      doubleEfficiencyUpgrade(56, 'dk rap prayers', 10e21, 6, 250),
      // spaceship
      doubleEfficiencyUpgrade(57, 'banana nebulae', 3.3e9, 7, 1),
      doubleEfficiencyUpgrade(58, 'wormholes', 16.5e9, 7, 1),
      doubleEfficiencyUpgrade(59, 'frequent flyer', 165e9, 7, 25),
      doubleEfficiencyUpgrade(60, 'warp drive', 16.5e12, 7, 50),
      doubleEfficiencyUpgrade(61, 'banana monoliths', 1.65e15, 7, 100),
      doubleEfficiencyUpgrade(62, 'generation ship', 165e15, 7, 150),
      doubleEfficiencyUpgrade(63, 'dyson sphere', 165e18, 7, 200),
      doubleEfficiencyUpgrade(64, 'final frontier', 165e21, 7, 250),
      // portal
      doubleEfficiencyUpgrade(65, 'ancient keyboard', 51e9, 8, 1),
      doubleEfficiencyUpgrade(66, 'typeling workers', 255e9, 8, 5),
      doubleEfficiencyUpgrade(67, 'soul bond', 2.55e12, 8, 25),
      doubleEfficiencyUpgrade(68, 'sanity dance', 255e12, 8, 50),
      doubleEfficiencyUpgrade(69, 'brane transplant', 25.5e15, 8, 100),
      doubleEfficiencyUpgrade(70, 'deity-sized portals', 2.55e18, 8, 150),
      doubleEfficiencyUpgrade(71, 'big crunch plan', 2.55e21, 8, 200),
      doubleEfficiencyUpgrade(72, 'maddening chants', 2.55e24, 8, 250),
      // time machine
      doubleEfficiencyUpgrade(73, 'flux capacitors', 750e9, 9, 1),
      doubleEfficiencyUpgrade(74, 'time paradox solver', 3.75e12, 9, 5),
      doubleEfficiencyUpgrade(75, 'quantum conundrum', 37.5e12, 9, 25),
      doubleEfficiencyUpgrade(76, 'causality enforcer', 3.75e15, 9, 50),
      doubleEfficiencyUpgrade(77, 'yestermorrow comp', 375e15, 9, 100),
      doubleEfficiencyUpgrade(78, 'far future enact', 37.5e18, 9, 150),
      doubleEfficiencyUpgrade(79, 'great loop hypo', 37.5e21, 9, 200),
      doubleEfficiencyUpgrade(80, 'second seconds', 37.5e24, 9, 250)
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
