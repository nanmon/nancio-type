import React from 'react';
import { netWpm, rawWpm } from '../util/handlers';
import { tuplify } from '../util/std';
import { getChars, getWords, getExtra } from '../util/text';
import { useTyper } from './Typer';
import '../styles/Stats.css';

function Stats() {
  const state = useTyper();
  const { stats, content, typed } = state;
  const acc = React.useMemo(() => {
    const total = getWords(content.text).join('').length;
    return (1 - stats.errors / total) * 100;
  }, [stats, content]);
  const counts = charCounts(content.text, typed);
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
      <div className="chart"/>
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