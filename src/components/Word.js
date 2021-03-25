import Char from "./Char";
import { useTyper } from "./StateProvider";
import { tuplify } from "../util/std";
import { chars, extra, getTextWidth } from "../util/text";
import '../styles/Word.css';

function Word({ text, typed, current }) {
  const { config } = useTyper();
  const _chars = tuplify(
    chars(text),
    chars(typed),
  );
  const extraStr = extra(text)(typed);
  chars(extraStr).forEach(char => {
    _chars.push([null, char]);
  });
  const redline = !current && typed && text !== typed;
  const className = [
    "Word", 
    redline && 'redline',
    current && 'current'
  ].filter(c => c).join(' ');
  const space = getTextWidth(' ', config);
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