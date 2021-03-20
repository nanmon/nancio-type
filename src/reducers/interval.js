export default function interval(state, action) {
  if (state.stats.count === 0) return state;
  const k = action.delta / 60 * 5; //transform to wpm
  return {
    ...state,
    stats: {
      ...state.stats,
      prevCount: state.stats.count,
      wpm: [
        ...state.stats.wpm,
        (state.stats.count - state.stats.prevCount) / k
      ]
    }
  }
}