import React from 'react';
import { useTyper } from "./Typer";

interface Props {
  position: Typer.CaretPosition | null;
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

  return (
    <span 
      className={className}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        transform: `translate(${position.x - 8}px, ${position.y - 2}px)`,
        color: config.colors.caret,
        visibility: focused ? 'visible' : 'hidden'
      }}
    >|
    </span>
  );
} 

export default Caret;