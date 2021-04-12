declare namespace Banana {
  interface State {
    bananas: number;
    bps: number;
    bpt: number;
    buildings: Building[];
    upgrades: Upgrade[];
    config: Config;
    tech: Tech
  }

  interface Building {
    id: number;
    name: string;
    bps: number;
    price: number;
    owned: number;
  }

  interface Upgrade {
    id: number,
    name: string;
    description?: string;
    price: number;
    unlocked: boolean;
    lock: Locks.Any;
    bought: boolean;
    effects: Effects.Any[];
  }

  interface Config {
  }

  interface Tech {
    lastTimestamp: number;
  }
  

  namespace Locks {
    type Any = Building | Banana | Typing;
  
    interface Building {
      type: 'building';
      buildingId: number;
      needed: number;
    }
  
    interface Banana {
      type: 'banana';
      needed: number;
    }
  
    interface Typing {
      type: 'typing';
      needed: number;
    }
  }

  namespace Effects {
    type Any = Efficiency | Gain;
  
    interface Efficiency {
      type: 'efficiency'
      buildingId: number;
      multiplier: number;
    }
  
    interface Gain {
      type: 'gain';
      buildingId: number;
      gainType: 'add' | 'multiply';
      gain: number;
    }
  }

  namespace Actions {
    type Any = Init | Tick | Typed | BuyBuilding | BuyUpgrade;

    interface Init {
      type: 'init';
      timestamp: number;
      load: boolean;
    }

    interface Tick {
      type: 'tick';
      timestamp: number;
    }

    interface Typed {
      type: 'typed';
      char: 'correct' | 'mistyped' | 'ignored';
    }

    interface BuyBuilding {
      type: 'buyBuilding';
      buildingId: number;
    }

    interface BuyUpgrade {
      type: 'buyUpgrade';
      upgradeId: number;
    }
  }
}