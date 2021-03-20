export default function init(_state, {content = {text: ''}}) {
  return {
    content,
    typed: '',
    screen: 'typing',
    stats: {
      count: 0, prevCount: 0, wpm: [], errors: 0
    },
    config: {
      font: 'monospace',
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