import React from 'react';


function Stats({ state }) {
  const { stats } = state;
  return (
    <>
      <p>Avg: {avg(stats.wpm)} wpm</p>
      <p>Time: {stats.wpm.length}s </p>
      <p>Errors: {stats.errors}</p>
    </>
  )
}

export default Stats;

function avg(array) {
  return array.reduce((s, v) => s + v, 0) / array.length;
}