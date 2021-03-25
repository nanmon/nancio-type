import React from 'react';
import reducer from '../reducers';

const StateContext = React.createContext<Typer.State>(init({ text: ''})!);
const DispatchContext = 
  React.createContext<React.Dispatch<Typer.Actions.Any> | null>(null);

interface Props {
  firstContent: () => Typer.Content;
  children: React.ReactChildren
}

export function TyperProvider({ firstContent, children }: Props) {
  const [state, dispatch] = React.useReducer(reducer, null, () => init(firstContent()));
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state!}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export function useTyper() {
  return React.useContext(StateContext);
}

export function useTyperDispatch() {
  return React.useContext(DispatchContext);
}

function init(content: Typer.Content) {
  return reducer(null, { type: 'init', content });
}