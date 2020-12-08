<template>
  <div>
    <div>
      <div>Pitch <input v-model="pitch" /></div>
      <div>Velocity <input v-model="velocity" /></div>
      <div>Duration (ms) <input v-model="duration" /></div>
    </div>

    <button type="submit" @click="sendMidiMessage(pitch, velocity, duration)">Send</button>
  </div>
</template>
<script>
import { ref } from 'vue';

export default {
  name: 'SendMessage',
  props: ['midiOut', 'selectOut'],
  setup(props) {
    const duration = ref(200);
    const pitch = ref(52);
    const velocity = ref(100);

    function sendMidiMessage(pitch, velocity, duration) {
      const NOTE_ON = 0x90;
      const NOTE_OFF = 0x80;

      const device = props.midiOut;
      const msgOn = [NOTE_ON, pitch, velocity];
      const msgOff = [NOTE_OFF, pitch, velocity];

      device.send(msgOn);
      device.send(msgOff, Date.now() + duration);
    }

    return { duration, pitch, sendMidiMessage, velocity };
  },
};
</script>
