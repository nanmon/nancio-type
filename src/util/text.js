import { last, tuplify } from './std'

export const words = (text = '') => {
  return text.split(' ').filter(w => w);
}

export const chars = (text = '') => {
  return text.split('');
}

export const extra = text => (typed = '') => {
  if (typed.length > text.length)
    return typed.substr(text.length);
  return '';
}

export const withExtra = (text, typed) => {
  const wtext = words(text);
  const wtyped = words(typed);
  return tuplify(wtext, wtyped).map(([text, typed]) => {
    return text + extra(text)(typed);
  }).join(' ');
}

export const getTextWidth = (text, {fontFamily, fontSize}) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = `${fontSize}px ${fontFamily}`;
  return context.measureText(text).width;
}