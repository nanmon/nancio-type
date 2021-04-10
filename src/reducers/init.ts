export default function init(
  state: Typer.State | null, 
  action: Typer.Actions.Init
): Typer.State {
  if (!action.reset) {
    return {
      ...state!,
      content: action.content
    }
  }
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
      width: 60, 
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