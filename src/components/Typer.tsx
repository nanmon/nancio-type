import React from 'react';
import reducer from '../reducers';
import Screens from './Screens';

export * from '../util/handlers';

const StateContext = 
  React.createContext<Typer.State>(init({ text: '' })!);
const DispatchContext = 
  React.createContext<React.Dispatch<Typer.Actions.Any> | null>(null);

interface Props {
  typed?: string;
  content: Typer.Content;
  restartOnContentChange?: boolean
  onType?(state: Typer.State): void;
  onKeyPress?(e: React.KeyboardEvent<HTMLInputElement>, direction: 'up' | 'down'): boolean
}

export function Typer({ 
  typed, 
  content, 
  onType,
  onKeyPress = () => false,
  restartOnContentChange = true 
}: Props) {
  const [state, dispatch] = React.useReducer(reducer, null, () => init(content));

  React.useEffect(() => {
    dispatch({ type: 'init', content, reset: restartOnContentChange });
  }, [content, restartOnContentChange]);

  React.useEffect(() => {
    dispatch({ type: 'merge', state: { typed }});
  }, [typed])

  const prevTyped = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!onType || prevTyped.current === state!.typed) return;
    if (prevTyped.current !== null) onType(state!);
    prevTyped.current = state!.typed;
  }, [state, onType]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state!}>
        <Screens onKeyPress={onKeyPress}/>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useTyper() {
  return React.useContext(StateContext);
}

export function useTyperDispatch() {
  return React.useContext(DispatchContext)!;
}

function init(content: Typer.Content) {
  return reducer(null, { type: 'init', content, reset: true });
}