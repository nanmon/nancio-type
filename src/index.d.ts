declare namespace Typer {
  interface State {
    content: Content;
    typed: string,
    screen: Screen,
    timeline: TimelineItem[];
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

  interface TimelineItem {
    timestamp: number;
    typed: string;
    char: string;
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

  interface CaretPosition {
    x: number; 
    y: number;
  }
}