import zip from 'lodash/zip';

export const IGNORED_CHARACTERS = ['', 'Backspace'];
export const IGNORED_MODIFIERS = ['Alt', 'AltGraph', 'Control', 'Fn', 'Meta', 'OS']

export const getWords = (text = '') => {
  return text.split(' ').filter(w => w);
}

export const getChars = (text = '') => {
  return text.split('');
}

export const getExtra = (text: string, typed = '') => {
  if (typed.length > text.length)
    return typed.substr(text.length);
  return '';
}

export const withExtra = (text: string, typed: string) => {
  const wtext = getWords(text);
  const wtyped = getWords(typed);
  return zip(wtext, wtyped).map(([text, typed]) => {
    return text + getExtra(text!, typed);
  }).join(' ');
}

export const getWidth = (
  text: string, 
  {fontFamily, fontSize}: {fontFamily: string, fontSize: number}
) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context!.font = `${fontSize}px ${fontFamily}`;
  return context!.measureText(text).width;
}

export const getCaretPosition = (lines: string[], typed: string): [number, number] => {
  const words = getWords(typed);
  let wcount = 0;
  const lineIndex = lines.findIndex(line => {
    const lwords = getWords(line);
    if (wcount + lwords.length >= words.length) return true;
    wcount += lwords.length;
    return false;
  });
  const lastWords = words.slice(wcount);
  let charIndex = lastWords.join(' ').length;
  if (typed.endsWith(' ')) charIndex++;
  return [charIndex, lineIndex];
}