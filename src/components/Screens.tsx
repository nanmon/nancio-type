import TypingTest from './TypingTest';
import Stats from './Stats';
import { useTyper } from './Typer';

function Screens() {

  const { screen } = useTyper();

  return screen === 'stats' 
        ? <Stats />
        : <TypingTest />;
}

export default Screens;