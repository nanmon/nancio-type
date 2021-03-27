import React from 'react';
import { Typer, lastWpm, isDoneTyping, netWpm } from "../../components/Typer";
import { clamp } from '../../util/std';
const audios = [
  undefined,
  require('./audios/1.wav').default,
  require('./audios/2.wav').default,
  require('./audios/3.wav').default,
  require('./audios/4.wav').default,
  require('./audios/5.wav').default,
  require('./audios/6.wav').default,
  require('./audios/7.wav').default,
]

const audioClamp = clamp(1, audios.length - 1);

function Yoshi() {
  const [content, setContent] = 
    React.useState<Typer.Content | null>(null);
  const [track, setTrack] = React.useState(0);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null)
  const refs = React.useRef<HTMLAudioElement[]>([]);

  React.useLayoutEffect(() => {
    const audioProm = Promise.all(
      refs.current.map(el => {
        el.load();
        return new Promise(resolve => {
          el.oncanplay = () => resolve(el);
        })
      })
    );
    fetch('/nancio-type/yoshi.txt').then(async r => {
      const text = await r.text();
      await audioProm;
      setContent({ text });
    });
  }, []);

  function onType(state: Typer.State) {
    if (timeoutId) clearTimeout(timeoutId);
    if (isDoneTyping(state)) {
      const net = netWpm(state);
      const index = audioClamp(Math.floor(net / 15));
      setTrack(index);
      return;
    }
    const wpm = lastWpm(state) | 0;
    const index = audioClamp(Math.floor(wpm / 15));
    setTrack(index);
    refs.current.forEach(e => {
      e.play();
    });
    const id = setTimeout(() => {
      setTrack(0);
      refs.current.forEach(e => {
        e.pause();
        e.currentTime = 0;
      })
    }, 1000);
    setTimeoutId(id);
  }

  if (!content) return <div>Loading...</div>;
  return (
    <>
      {audios.map((src, index) => src &&
        <audio 
          key={index} 
          ref={r => refs.current[index - 1] = r!}
          muted={index !== track}
          preload="auto"
          loop 
        >
          <source src={src} type="audio/wav"/>
        </audio>
      ) }
      <Typer content={content} onType={onType}/>
    </>
  );
}

export default Yoshi;