export default function screen(
  state: Typer.State, 
  action: Typer.Actions.Screen
): Typer.State {
  return {
    ...state,
    screen: action.screen
  }
}