declare namespace Banana {
  interface State {
    bananas: number;
    totalBananas: number;
    bpsMultiplier: number;
    typer: Typer;
    buildings: Building[];
    upgrades: Upgrade[];
    config: Config;
    tech: Tech
  }

  interface Typer {
    bpt: number;
    multiplier: number;
    gain: number;
    cpsPercent: number;
    count: number;
    totalBananas: number;
  }

  interface Building {
    id: number;
    name: string;
    baseBps: number;
    multiplier: number;
    price: number;
    owned: number;
    unlocked: boolean;
    unlocksAt: number;
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
    type Any = Efficiency | Gain | Typing | BpsMultiplier;
  
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

    interface Typing {
      type: 'typing';
      cpsPercent: number;
    }

    interface BpsMultiplier {
      type: 'bpsMultiplier';
      bonus: number;
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