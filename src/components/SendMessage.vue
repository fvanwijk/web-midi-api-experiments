<template>
  <div>
    <div>
      <div>Pitch <input v-model="pitch" /></div>
      <div>Velocity <input v-model="velocity" /></div>
      <div>Duration (ms) <input v-model="duration" /></div>
    </div>

    <button type="submit" @click="sendMidiMessage(duration)">Send direct</button>
    <button type="submit" @click="sendMidiMessageWebSocket(duration)">Send WS</button>
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

    const ws = ref(new WebSocket('ws://35.233.20.180:8080/'));
    ws.value.addEventListener('open', () => {
      console.log('websocket connection opened');
    });
    ws.value.addEventListener('message', async msg => {
      const text = await msg.data.arrayBuffer();
      console.log('MESSAGE RECEIVED', text);
    });

    function createMidiMessagePair() {
      const NOTE_ON = 0x90;
      const NOTE_OFF = 0x80;

      const msgOn = [NOTE_ON, pitch.value, velocity.value];
      const msgOff = [NOTE_OFF, pitch.value, velocity.value];

      return [msgOn, msgOff];
    }

    function sendMidiMessage(duration) {
      const [msgOn, msgOff] = createMidiMessagePair();

      const device = props.midiOut;
      device.send(msgOn);
      device.send(msgOff, Date.now() + duration);
    }

    function sendMidiMessageWebSocket(duration) {
      const [msgOn, msgOff] = createMidiMessagePair();

      ws.value.send(msgOn);
      console.log('send on');
      setTimeout(() => {
        console.log('send off', msgOff);
        ws.value.send(msgOff);
      }, duration);
    }

    return { ws, duration, pitch, sendMidiMessage, sendMidiMessageWebSocket, velocity };
  },
};
</script>
