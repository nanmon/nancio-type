import React from 'react';
import init from './init';
import tick from './tick';
import typed from './typed';
import buyBuilding from './buyBuilding';

type Reducer = (state: Banana.State, action: Banana.Actions.Any) => Banana.State

const ducers = { init, tick, typed, buyBuilding };

function reducer(state: Banana.State, action: Banana.Actions.Any) {
  const r = ducers[action.type] as Reducer;
  if (!r) return state;
  return r(state, action);
}

function useBanana(initialState: Banana.State | null = null) {
  return React.useReducer(reducer, null, () => 
    init(initialState, { type: 'init', timestamp: Date.now(), load: initialState != null })
  )
}

export default useBanana;