export const words = (text) => {
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

export const getTextWidth = (text, font = "500 24px monospace") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  return context.measureText(text).width;
}