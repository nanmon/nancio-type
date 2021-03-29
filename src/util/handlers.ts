import { avg, last, tuplify } from "./std";
import { getChars, getExtra, getWords, IGNORED_CHARACTERS } from "./text";

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

export function netWpm(state: Pick<Typer.State, 'timeline' | 'content' | 'typed'>) {
  return rawWpm(state) - unfixedErrors(state) / typedMilis(state) * 1000 * 60;
}

export function rawWpm(state: Pick<Typer.State, 'timeline'>) {
  return typedCount(state) / typedMilis(state) * 1000 * 60 / 5;
}

export function typedCount(state: Pick<Typer.State, 'timeline'>) {
  return state.timeline
    .filter(i => !IGNORED_CHARACTERS.includes(i.char))
    .length;
}

export function typedMilis(state: Pick<Typer.State, 'timeline'>) {
  return last(state.timeline).timestamp - state.timeline[0].timestamp;
}

export function unfixedErrors(state: Pick<Typer.State, 'typed' | 'content'>) {
  let errors = 0;
  const typedWords = getWords(state.typed);
  tuplify(
    typedWords,
    getWords(state.content.text),
  ).forEach(([typedWord, word], index) => {
    if (index < typedWords.length -1 && word.length > typedWord.length) {
      errors++; // all missings as one error
    }
    tuplify(
      getChars(typedWord),
      getChars(word),
    ).forEach(([typedChar, char]) => {
      if (char === typedChar) return;
      errors++; // extras and incorrects
    });
  });
  return errors;
}

export function groupTimeline(
  state: Typer.State, 
  groupMilis: number = 1000
): Typer.TimelineItem[][] {
  let groups: Typer.TimelineItem[][] = [];
  let [firstItem, ...rest] = state.timeline;
  let prevTimestamp = firstItem.timestamp;
  let accumTime = 0;
  let currentGroup = [firstItem];
  rest.forEach(item => {
    accumTime += item.timestamp - prevTimestamp;
    prevTimestamp = item.timestamp;
    currentGroup.push(item);
    while (accumTime >= groupMilis) {
      accumTime -= groupMilis;
      groups.push(currentGroup);
      currentGroup = [];
    }
  });
  if (currentGroup.length > 0) groups.push(currentGroup);
  return groups;
}

export function mistypedLast(
  state: Pick<Typer.State, 'typed' | 'content'>
) {
  const { typed, content } = state;
  const char = last(typed);
  if (IGNORED_CHARACTERS.includes(char)) return false;

  const wordsTyped = getWords(typed);
  const lastWord = last(wordsTyped);
  const actualWord = getWords(content.text)[wordsTyped.length - 1];

  // it'd be like that sometimes
  if (!actualWord) return false;

  if (typed.endsWith(' ')) {
    // not extra, missing
    const missing = actualWord.length - lastWord.length;
    return missing > 0;
  }

  const lastChar = lastWord[lastWord.length - 1];
  const actualChar = actualWord[lastWord.length - 1];
  return actualChar !== lastChar;
}