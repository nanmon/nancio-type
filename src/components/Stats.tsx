import React from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, Tooltip } from 'recharts';
import { groupTimeline, netWpm, rawWpm, mistypedLast } from '../util/handlers';
import { avg, last, sum, tuplify } from '../util/std';
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
    let timelineCount = 0;
    const data = groupTimeline(state).map((timeline, index) => {
      timelineCount += timeline.length;
      const typed = last(timeline).typed;
      const st = { typed, content, timeline };
      const raw = Math.round(rawWpm(st));
      st.timeline = state.timeline.slice(0, timelineCount);
      const wpm = Math.round(netWpm(st));
      const errors = timeline.reduce((errs, item) => {
        return errs + Number(mistypedLast({
          typed: item.typed,
          content: st.content
        }));
      }, 0);
      return { second: index + 1, wpm, raw, errors };
    });
    const time = (last(state.timeline).timestamp - state.timeline[0].timestamp) / 1000
    last(data).second = time;
    return data;
  }, [stats]);

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
        <Line type="monotone" yAxisId="wpm" dataKey="raw" stroke="darkred"/>
        <Line type="monotone" yAxisId="wpm" dataKey="wpm" stroke="red"/>
        <Scatter type="monotone" yAxisId="errors" dataKey="errors" stroke="gray"/>
        <XAxis 
          type="number" 
          dataKey="second" 
          tickCount={10}
          domain={[1, 'dataMax']}
        />
        <YAxis yAxisId="wpm"/>
        <YAxis yAxisId="errors" orientation="right"/>
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
