import React from 'react';
import { ComposedChart, Line, Scatter, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { netWpm, rawWpm, mistypedLast, timeSlice } from '../util/handlers';
import { last, tuplify } from '../util/std';
import { getChars, getWords, getExtra } from '../util/text';
import { useTyper } from './Typer';
import '../styles/Stats.css';

function Stats() {
  const state = useTyper();
  const { stats, content, typed, config } = state;
  const acc = React.useMemo(() => {
    const total = getWords(content.text).join('').length;
    return (1 - stats.errors / total) * 100;
  }, [stats, content]);

  const counts = charCounts(content.text, typed);

  const chartData = React.useMemo(() => {
    const startTime = state.timeline[0].timestamp;
    let time = (last(state.timeline).timestamp - startTime) / 1000;
    const data = Array
      .from({ length: Math.round(time) })
      .map((_, index) => {
        return { 
          second: index + 1, 
          wpm: wpmPoint(state, index),
          raw: slicePoint(state, index), 
          errors: errorPoint(state, index)
        };
      });
    last(data).second = time;
    return data;
  }, [state]);

  return (
    <div className="Stats">
      <div className="wpm">
        <h3>wpm</h3>
        <h2>{Math.round(netWpm(state))}</h2>
      </div>
      <div className="acc">
        <h3>acc</h3>
        <h2>{Math.round(acc)}%</h2>
      </div>
      <div className="chart">
        <ComposedChart width={config.width} height={300} data={chartData}>
          <Line type="monotone" yAxisId="wpm" dataKey="raw" stroke="darkred" fill="darkred"/>
          <Line type="monotone" yAxisId="wpm" dataKey="wpm" stroke="red" fill="red"/>
          <Scatter type="monotone" yAxisId="errors" dataKey="errors" stroke="black" fill="gray"/>
          <CartesianGrid stroke="#fff3" strokeDasharray="5 5" />
          <XAxis 
            type="number" 
            dataKey="second" 
            tickCount={10}
            domain={[1, 'dataMax']}
            allowDecimals={false}
          />
          <YAxis yAxisId="wpm"/>
          <YAxis yAxisId="errors" orientation="right" allowDecimals={false}/>
          <Tooltip/>
        </ComposedChart>
      </div>
      <div className="raw">
        <h3>raw</h3>
        <h2>{Math.round(rawWpm(state))}</h2>
      </div>
      <div className="chars">
        <h3>characters</h3>
        <h2>{counts.correct}/{counts.incorrect}/{counts.extra}/{counts.missing}</h2>
      </div>
      <div className="time">
        <h3>time</h3>
        <h2>{stats.wpm.length}s</h2>
      </div>
    </div>
  )
}

export default Stats;

function charCounts(text: string, typed: string) {
  let correct = 0, incorrect = 0, missing = 0, extras = 0
  tuplify(
    getWords(text),
    getWords(typed)
  ).forEach(([wtext, wtyped]) => {
    tuplify(
      getChars(wtext),
      getChars(wtyped)
    ).forEach(([chtext, chtyped]) => {
      if (!chtyped) missing++;
      else if (chtext === chtyped) correct++;
      else incorrect++;
    });
    getChars(getExtra(wtext, wtyped)).forEach(() => extras++);
  })
  return {correct, incorrect, missing, extra: extras }
}

function slicePoint(state: Typer.State, second: number) {
  const startTime = state.timeline[0].timestamp;
  let slice = timeSlice(
    state, 
    startTime + (second - 1) * 1000,
    startTime + (second + 2) * 1000,
    false
  );
  const typed = last(slice).typed;
  const st = { typed, content: state.content, timeline: slice };
  return Math.round(rawWpm(st));
}

function wpmPoint(state: Typer.State, second: number) {
  const startTime = state.timeline[0].timestamp;
  let slice = timeSlice(
    state, 
    startTime,
    startTime + (second + 1) * 1000,
    true
  );
  const typed = last(slice).typed;
  const st = { typed, content: state.content, timeline: slice };
  return Math.round(netWpm(st));
}

function errorPoint(state: Typer.State, second: number) {
const startTime = state.timeline[0].timestamp;
  let slice = timeSlice(
    state, 
    startTime + second * 1000,
    startTime + (second + 1) * 1000,
    false
  );
  return slice.reduce((errs, item) => {
    return errs + Number(mistypedLast({
      typed: item.typed,
      content: state.content
    }));
  }, 0) || null;
}