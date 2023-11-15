import { useEffect, useRef, useState } from 'react';
import './App.css'
import { Input, Note, Output, WebMidi } from "webmidi";
import Metronome from './components/metronome/metronome';

const App = () => {
  const [inputs, setInputs] = useState<Input[]>([])
  const [outputs, setOutputs] = useState<Output[]>([])
  const [currentNote, setCurrentNote] = useState<{ note: Note, numBeat: string, scorePercentage: number }>()
  const [notes, setNotes] = useState<{ note: Note, numBeat: string, scorePercentage: number }[]>([]) // New state variable
  const [tempo, setTempo] = useState(120);
  const interval = useRef(60000 / tempo);
  const lastClick = useRef(Date.now());

  let hasSet = false;

  useEffect(() => {
    interval.current = (60000 / tempo);
  }, [tempo]);

  useEffect(() => {
    if (hasSet) return;
    hasSet = true;
    WebMidi
      .enable()
      .then(onEnabled)
      .catch(err => alert(err));

    function onEnabled() {
      console.log('hello')
      setInputs(WebMidi.inputs)
      setOutputs(WebMidi.outputs)
      // Inputs
      WebMidi.inputs[1].addListener('noteon', e => {
        const now = Date.now();
        const timingDifferenceMs = now - lastClick.current;
        const timingDifferenceBeats = timingDifferenceMs / interval.current;
        const smallestNoteValue = 1 / 16; // Support sixteenth notes
        const timingDifferenceSmallestNotes = timingDifferenceBeats / smallestNoteValue;

        const wholeNumber = Math.floor(timingDifferenceSmallestNotes);
        const wholeNumberBeats = Math.floor(wholeNumber / 16);
        const fraction = timingDifferenceSmallestNotes - wholeNumber;
        const numerator = Math.round(fraction * 16);
        const timingDifferenceString = `${wholeNumberBeats} ${numerator}/16`;

        const score = Math.abs(1 - timingDifferenceBeats);
        const scorePercentage = Math.max(0, (1 - score) * 100);

        lastClick.current = now;
        setNotes(prevNotes => [...prevNotes, {
          note: e.note,
          numBeat: timingDifferenceString,
          scorePercentage
        }]);
        setCurrentNote({
          note: e.note,
          numBeat: timingDifferenceString,
          scorePercentage
        });
      });
    }

  }, []);


  return (
    <>
      <h1>WebMidi</h1>
      <h2>Inputs</h2>
      <ul>
        {inputs.map(input => (
          <li key={input.id}>{input.name}</li>
        ))}
      </ul>
      <h2>Outputs</h2>
      <ul>
        {outputs.map(output => (
          <li key={output.id}>{output.name}</li>
        ))}
      </ul>
      <h2>Current Note</h2>
      {currentNote && (
        <div>
          <div>Accuracy: {currentNote.scorePercentage.toFixed(2)}%</div>
        </div>
      )}
      <Metronome tempo={tempo} setTempo={setTempo} />
      <h2>Notes</h2>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note.note.name} {note.scorePercentage.toFixed(2)}%</li>
        ))}
      </ul>
    </>
  )
}

export default App
