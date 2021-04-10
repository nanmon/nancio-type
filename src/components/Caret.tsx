import React from 'react';
import { getWidth } from '../util/text';
import { useTyper } from "./Typer";

interface Props {
  position: [number, number];
  focused: boolean;
}

function Caret({ position, focused }: Props) {
  const { config, typed } = useTyper();
  const [className, setClassName] = React.useState('caret');

  React.useEffect(() => {
    setClassName('caret');
    const timeoutId = setTimeout(() => {
      setClassName('caret animated');
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [typed]);

  if (!position) return null;
  const [x, y] = position;
  const charWidth = getWidth('a', config);
  const clampedY = y ? 1 : 0;
  return (
    <span 
      className={className}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        transform: `translate(${x * charWidth + 3}px, ${clampedY * config.lineHeight + 5}px)`,
        color: config.colors.caret,
        visibility: focused ? 'visible' : 'hidden'
      }}
    >|
    </span>
  );
} 

export default Caret;