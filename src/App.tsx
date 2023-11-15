import { useState } from 'react';
import './App.css'
import { Input, Note, Output, WebMidi } from "webmidi";

const App = () => {
  const [inputs, setInputs] = useState<Input[]>([])
  const [outputs, setOutputs] = useState<Output[]>([])
  const [currentNote, setCurrentNote] = useState<Note>()

  WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));

  function onEnabled() {

    setInputs(WebMidi.inputs)
    setOutputs(WebMidi.outputs)
    // Inputs
    WebMidi.inputs.forEach(input => {
      console.log(input.manufacturer, input.name)
      input.addListener('noteon', e => {
        console.log(e.note.name + e.note.octave)
        setCurrentNote(e.note);

      });

      // Outputs
      WebMidi.outputs.forEach(output => {
        console.log(output.manufacturer, output.name)
        output.playNote("C4", {
          duration: 500,
        });
      });

    });
  }

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
          <div>{currentNote.name}</div>
          <div>{currentNote.octave}</div>
        </div>
      )}
    </>
  )
}

export default App
