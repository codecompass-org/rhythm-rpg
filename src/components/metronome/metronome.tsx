import React, { useState, useEffect } from 'react';
import metronomeAudio from '../../assets/audio/Perc_Clap_lo.wav';

const Metronome: React.FC<{ tempo: number, setTempo: (arg0: number) => void }> = ({ tempo, setTempo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const audio = new Audio(metronomeAudio); // Replace with your file path

  useEffect(() => {
    if (isPlaying) {
      playBeat();
    } else {
      stopBeat();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlaying, tempo]);

  const playBeat = () => {
    if (timer) {
      clearInterval(timer);
    }
    const interval = (60 / tempo) * 1000;
    setTimer(setInterval(() => {
      audio.play();
    }, interval));
  };

  const stopBeat = () => {
    if (timer) {
      clearInterval(timer);
    }
    setTimer(null);
  };

  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
      <input
        type="range"
        min="40"
        max="240"
        value={tempo}
        onChange={(e) => setTempo(parseInt(e.target.value))}
      />
      <p>Tempo: {tempo} BPM</p>
    </>
  );
};

export default Metronome;
