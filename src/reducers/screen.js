export default function screen(state, action) {
  return {
    ...state,
    screen: action.screen
  }
}