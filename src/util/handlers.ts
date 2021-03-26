import { last, tuplify } from "./std";
import { getChars, getExtra, getWords } from "./text";

export function didType(state: Typer.State, str: string) {
  const { typed, content } = state;
  const startIndex = content.text.indexOf(str);
  if (startIndex === -1)
    throw Error('string not found in text');
  const endIndex = startIndex + str.length;
  const substr = content.text.substr(0, endIndex);
  const subWords = getWords(substr);
  const typedWords = getWords(typed);
  return typedWords.length >= subWords.length;
}

export function wordStats(state: Typer.State, wordIndex: number) {
  const { typed, content } = state;
  const stats = { left: 0, correct: 0, extra: 0, wrong: 0 }
  const word = getWords(content.text)[wordIndex];
  const typedWord = getWords(typed)[wordIndex];
  if (!typedWord) {
    stats.left = word.length;
    return stats;
  }
  tuplify(
    getChars(word),
    getChars(typedWord),
  ).forEach(([char, typedChar]) => {
    if (!typedChar) stats.left++;
    else if (char === typedChar) stats.correct++;
    else stats.wrong++;
  });
  const extraStr = getExtra(word, typedWord);
  getChars(extraStr).forEach(() => {
    stats.extra++;
  });
  return stats;
}

export function lastWpm(state: Typer.State) {
  return last(state.stats.wpm);
}

export function isDoneTyping({ typed, content }: Typer.State) {
  const typedWords = getWords(typed);
  const allWords = getWords(content.text);
  if (typedWords.length < allWords.length) return false;
  if (typed.endsWith(' ')) return true;
  const lastTyped = typedWords.pop();
  const lastWord = allWords.pop();
  return lastTyped === lastWord;
}