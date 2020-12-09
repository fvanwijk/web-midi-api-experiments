<template>
  <div class="bg-blue-100 py-6">
    <div class="container">
      <h1 class="text-4xl font-bold mb-8">🎹 Web MIDI API Experiments</h1>
      <table class="mt-4">
        <tbody>
          <tr>
            <th>Inputs</th>
            <td><Input type="input" :values="inputs" /></td>
          </tr>
          <tr>
            <th>Outputs</th>
            <td><Input type="output" :values="outputs" /></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="container py-6">
    <div v-if="error" class="inline-block py-2 px-3 rounded border border-red-200 bg-red-100 text-red-700 mb-4">
      ⚠ {{ error }}
    </div>

    <div class="grid grid-cols-2">
      <div>
        <h2 class="text-2xl font-bold mb-4">Log of inputs</h2>
        <Log :log="log" />
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-4">Send midi message</h2>
        <SendMessage :midiOut="outputs?.[0]" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Input from './components/Input';
import Log from './components/Log';
import SendMessage from './components/SendMessage';

export default {
  name: 'Devices',
  components: { Input, Log, SendMessage },
  props: {
    msg: String,
  },
  setup() {
    function connect() {
      if (window.navigator && 'function' === typeof window.navigator.requestMIDIAccess) {
        return window.navigator.requestMIDIAccess();
      } else {
        throw 'No Web MIDI support';
      }
    }

    const error = ref();
    const inputs = ref([]);
    const outputs = ref([]);
    const log = ref([]);

    onMounted(async () => {
      try {
        const res = await connect();
        inputs.value = Array.from(res.inputs.values());
        for (let input of res.inputs.values()) {
          input.addEventListener('midimessage', e => {
            log.value.push(e);
          });
        }
        outputs.value = Array.from(res.outputs.values());
      } catch (e) {
        console.log(e);
        error.value = 'Could not get MIDI access';
      }
    });

    return { connect, error, inputs, log, outputs };
  },
};
</script>
