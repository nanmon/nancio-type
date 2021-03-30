export default function init(
  _state: Typer.State | null, 
  action: Typer.Actions.Init
): Typer.State {
  return {
    content: action.content,
    typed: '',
    screen: 'typing',
    temp: {
      prevTime: 0,
      delta: 0,
      errors: 0,
      count: 0
    },
    timeline: [],
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