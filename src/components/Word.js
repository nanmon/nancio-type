import Char from "./Char";
import { useTyper } from "./StateProvider";
import { tuplify } from "../util/std";
import { getChars, getExtra, getWidth } from "../util/text";
import '../styles/Word.css';

function Word({ text, typed, current }) {
  const { config } = useTyper();
  const _chars = tuplify(
    getChars(text),
    getChars(typed),
  );
  const extraStr = getExtra(text, typed);
  getChars(extraStr).forEach(char => {
    _chars.push([null, char]);
  });
  const redline = !current && typed && text !== typed;
  const className = [
    "Word", 
    redline && 'redline',
    current && 'current'
  ].filter(c => c).join(' ');
  const space = getWidth(' ', config);
  return (
    <div className={className} style={{marginRight: space}}>
      {_chars.map(([text, typed], index) => 
        <Char 
          key={index}
          text={text}
          typed={typed}
        />
      )}
    </div>
  );
}

export default Word;