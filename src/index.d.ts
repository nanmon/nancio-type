namespace Typer {
  interface State {
    content: Content;
    typed: string,
    screen: Screen,
    stats: Stats,
    temp: {
      prevTime: number,
      delta: number,
      errors: number,
      count: number
    },
    config: Config;
  }

  type Screen = 'typing' | 'stats';

  interface Content {
    text: string;
  }

  interface Stats {
    count: number;
    prevCount: number;
    wpm: number[];
    errors: number;
    errs: number[];
  }

  interface Config {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    width: number;
    colors: Colors;
  }

  interface Colors {
    left: string;
    correct: string;
    wrong: string;
    extra: string;
    caret: string;
  }

  namespace Actions {
    type Any = Actions.Init | Actions.Screen | Actions.Typing;

    interface Init {
      type: 'init';
      content: Content;
    }

    interface Screen {
      type: 'screen';
      screen: Typer.Screen
    }

    interface Typing {
      type: 'typing';
      char: string;
      time: number;
    }
  }
}