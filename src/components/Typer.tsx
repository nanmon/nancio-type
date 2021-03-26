import React from 'react';
import reducer from '../reducers';
import Screens from './Screens';

export * from '../util/handlers';

const StateContext = 
  React.createContext<Typer.State>(init({ text: '' })!);
const DispatchContext = 
  React.createContext<React.Dispatch<Typer.Actions.Any> | null>(null);

interface Props {
  content: Typer.Content;
  onType?(state: Typer.State): void;
}

export function Typer({ content, onType }: Props) {
  const [state, dispatch] = React.useReducer(reducer, null, () => init(content));

  React.useEffect(() => {
    dispatch({type: 'init', content });
  }, [content]);

  const prevTyped = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!onType || prevTyped.current === state!.typed) return;
    if (prevTyped.current !== null) onType(state!);
    prevTyped.current = state!.typed;
  }, [state, onType]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state!}>
        <Screens/>
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
  return reducer(null, { type: 'init', content });
}