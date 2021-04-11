declare namespace Banana {
  interface State {
    bananas: number;
    bps: number;
    bpt: number;
    buildings: Building[];
    config: Config;
    tech: Tech
  }

  interface Building {
    id: number;
    name: string;
    bps: number;
    price: number;
    keybind: string;
    owned: number;
  }

  interface Config {
  }

  interface Tech {
    lastTimestamp: number;
  }

  namespace Actions {
    type Any = Init | Tick | BuyBuilding | Typed;

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
  }
}