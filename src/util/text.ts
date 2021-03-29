import { tuplify } from './std'

export const IGNORED_CHARACTERS = ['', 'Backspace'];

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
  return tuplify(wtext, wtyped).map(([text, typed]) => {
    return text + getExtra(text, typed);
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