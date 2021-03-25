export default function init(
  _state: Typer.State, 
  action: Typer.Actions.Init
): Typer.State {
  return {
    content: action.content,
    typed: '',
    screen: 'typing',
    stats: {
      count: 0, 
      prevCount: 0, 
      wpm: [], 
      errors: 0,
      errs: []
    },
    temp: {
      prevTime: 0,
      delta: 0,
      errors: 0,
      count: 0
    },
    config: {
      fontFamily: 'monospace',
      fontSize: 24,
      lineHeight: 30,
      width: 800, 
      colors: {
        left: 'gray',
        correct: 'white',
        wrong: 'red',
        extra: 'darkred',
        caret: 'cyan'
      }
    }
  }
}