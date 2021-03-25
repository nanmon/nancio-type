import React from 'react';
import { tuplify } from '../util/std';
import { getChars, getWords, getExtra } from '../util/text';


function Stats({ state }) {
  const { stats, content, typed } = state;
  const acc = (1 - stats.errors / content.text.length) * 100
  const counts = charCounts(content.text, typed);
  return (
    <>
      <p>Avg: {avg(stats.wpm)} wpm</p>
      <p>Time: {stats.wpm.length}s </p>
      <p>Acc: {acc}%</p>
      <p title="correct/incorrect/extra/missing">Chars: {counts.correct}/{counts.incorrect}/{counts.extra}/{counts.missing}</p>
    </>
  )
}

export default Stats;

function avg(array) {
  return array.reduce((s, v) => s + v, 0) / array.length;
}

function charCounts(text, typed) {
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