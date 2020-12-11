<template>
  <div>
    <table class="mb-4">
      <tr>
        <th><label for="pitch">Pitch (60 is Middle C)</label></th>
        <td><input id="pitch" type="number" v-model="pitch" /></td>
      </tr>
      <tr>
        <th><label for="velocity">Velocity (0-127)</label></th>
        <td>
          <input id="velocity" type="number" v-model="velocity" />
        </td>
      </tr>
      <tr>
        <th><label for="duration">Duration (ms)</label></th>
        <td><input id="duration" type="number" v-model="duration" /></td>
      </tr>
    </table>

    <button type="submit" @click="sendMidiMessage(duration)" class="mr-2">Send direct</button>
    <button type="submit" @click="sendMidiMessageWebSocket(duration)">Send WS</button>
  </div>
</template>
<script>
import { ref } from 'vue';

import { useWebSocketConnection } from './useWebSocketConnection';

export default {
  name: 'SendMessage',
  props: ['selectedOutput'],
  setup(props) {
    const duration = ref(200);
    const pitch = ref(52);
    const velocity = ref(100);

    const { ws } = useWebSocketConnection();
    ws.value.addEventListener('message', async msg => {
      console.log('MESSAGE RECEIVED', msg.data);
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

      const device = props.selectedOutput;
      device.send(msgOn);
      device.send(msgOff, Date.now() + duration);
    }

    function sendMidiMessageWebSocket(duration) {
      const [msgOn, msgOff] = createMidiMessagePair();

      console.log('send on', msgOn);
      ws.value.send(msgOn);

      setTimeout(() => {
        console.log('send off', msgOff);
        ws.value.send(msgOff);
      }, duration);
    }

    return { ws, duration, pitch, sendMidiMessage, sendMidiMessageWebSocket, velocity };
  },
};
</script>
<style scoped lang="postcss">
.form {
  grid-template-columns: 140px 80px;
}
</style>
