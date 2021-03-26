import React from 'react';
import reducer from '../reducers';
import Screens from './Screens';

const StateContext = React.createContext<Typer.State>(init({ text: ''})!);
const DispatchContext = 
  React.createContext<React.Dispatch<Typer.Actions.Any> | null>(null);

interface Props {
  content: Typer.Content;
}

export function Typer({ content }: Props) {
  const [state, dispatch] = React.useReducer(reducer, null, () => init(content));

  React.useEffect(() => {
    dispatch({type: 'init', content });
  }, [content]);

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