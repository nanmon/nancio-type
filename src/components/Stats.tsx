import React from 'react';
import { netWpm, rawWpm } from '../util/handlers';
import { tuplify } from '../util/std';
import { getChars, getWords, getExtra } from '../util/text';
import { useTyper } from './Typer';

function Stats() {
  const state = useTyper();
  const { stats, content, typed } = state;
  const acc = React.useMemo(() => {
    const total = getWords(content.text).join('').length;
    return (1 - stats.errors / total) * 100;
  }, [stats, content]);
  const counts = charCounts(content.text, typed);
  return (
    <>
      <p title="net/raw">Wpm: {Math.round(netWpm(state))}/{Math.round(rawWpm(state))}</p>
      <p>Time: {stats.wpm.length}s </p>
      <p>Acc: {Math.round(acc)}%</p>
      <p title="correct/incorrect/extra/missing">Chars: {counts.correct}/{counts.incorrect}/{counts.extra}/{counts.missing}</p>
    </>
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