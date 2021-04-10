import React from 'react';
import last from 'lodash/last';
import zip from 'lodash/zip';
import { ComposedChart, Line, Scatter, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { netWpm, rawWpm, mistypedLast, timeSlice } from '../util/handlers';
import { getChars, getWords } from '../util/text';
import { useTyper } from './Typer';
import '../styles/Stats.css';

function Stats() {
  const state = useTyper();
  const { content, typed, config } = state;

  const counts = charCounts(content.text, typed);
  const startTime = state.timeline[0].timestamp;
  const duration = (last(state.timeline)!.timestamp - startTime) / 1000;

  const chartData = React.useMemo(() => {
    const data = Array
      .from({ length: Math.round(duration)  })
      .map((_, index) => {
        return { 
          second: index + 1, 
          wpm: wpmPoint(state, index),
          raw: slicePoint(state, index), 
          errors: errorPoint(state, index),
          typed: typedPoint(state, index)
        };
      });
    last(data)!.second = duration;
    return data;
  }, [state, duration]);

  const acc = React.useMemo(() => {
    const total = getWords(content.text).join('').length;
    const errors = chartData.reduce((sum, d) => (
      d.errors ? sum + d.errors : sum
    ), 0)
    return (1 - errors / total) * 100;
  }, [chartData, content]);

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
        <h2>{Math.round(duration)}s</h2>
      </div>
    </div>
  )
}

export default Stats;

function charCounts(text: string, typed: string) {
  let correct = 0, incorrect = 0, missing = 0, extras = 0
  zip(
    getWords(text),
    getWords(typed)
  ).forEach(([wtext, wtyped]) => {
    zip(
      getChars(wtext),
      getChars(wtyped)
    ).forEach(([chtext, chtyped]) => {
      if (!chtext) extras++;
      if (!chtyped) missing++;
      else if (chtext === chtyped) correct++;
      else incorrect++;
    });
    correct++; // spaces
  });
  correct--; // does not end with space
  return {correct, incorrect, missing, extra: extras }
}

function slicePoint(state: Typer.State, second: number) {
  const startTime = state.timeline[0].timestamp;
  let slice = timeSlice(
    state, 
    startTime + (second - 1) * 1000,
    startTime + (second + 2) * 1000,
    true
  );
  if (slice.length === 0) return 0;
  const typed = last(slice)!.typed;
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
  if (slice.length === 0) return 0;
  const typed = last(slice)!.typed;
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
  if (slice.length === 0) return null;
  return slice.reduce((errs, item) => {
    return errs + Number(mistypedLast({
      typed: item.typed,
      content: state.content
    }));
  }, 0) || null;
}

function typedPoint(state: Typer.State, second: number) {
  const startTime = state.timeline[0].timestamp;
  let slice = timeSlice(
    state, 
    startTime,
    startTime + (second + 1) * 1000,
    false
  );
  if (slice.length === 0) return '';
  return last(slice)!.typed;
}