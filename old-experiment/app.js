connect().then(midi => {
  console.log(midi);
  midi.outputs.forEach(function (key, port) {
    console.log(key, port);
  });

  /*midi.onmessagereceived(message => {
    console.log(message);
  });*/

  window.addEventListener('keydown', e => {
    var midiEvent = {
      'eventName': 'MIDIMessageEvent',
      'data': [144, 13, 100],
      'timeStamp': e.timeStamp
    };
    console.log(midiEvent);
    window.postMessage(midiEvent, '*');
  })
});