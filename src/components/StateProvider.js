import React from 'react';
import reducer from '../reducers';

const StateContext = React.createContext();
const DispatchContext = React.createContext();

export function TyperProvider({ firstContent, children }) {
  const [state, dispatch] = React.useReducer(reducer, null, () => init(firstContent()));
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
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

function init(content) {
  return reducer(null, { type: 'init', content });
}