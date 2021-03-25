import React from 'react';
import { last } from '../util/std';

export function useCaret(typed: string, config: Typer.Config) {
  const [pos, setPos] = React.useState<Position | null>(null);

  React.useEffect(() => {
    const wordEl = document.querySelector('.Word.current');
    if (!wordEl) return;
    const wordsEl = document.querySelector('.words')!;
    const originRect = wordsEl.getBoundingClientRect();
    const wrect = wordEl.getBoundingClientRect();
    let charsTyped = wordEl.querySelectorAll('.Char:not(.left)');
    if (charsTyped.length === 0) {
      setPos({
        x: wrect.left - originRect.left,
        y: wrect.bottom - originRect.top - config.lineHeight
      });
      return;
    }
    const char = last(charsTyped);
    const rect = char.getBoundingClientRect();
    setPos({
      x: rect.right - originRect.left,
      y: wrect.bottom - originRect.top - config.lineHeight
    });
  }, [typed, config]);

  return pos
}

interface Position {
  x: number; y: number;
}