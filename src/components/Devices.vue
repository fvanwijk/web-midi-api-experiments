<template>
  <div class="container">
    <h1>Web MIDI API Experiments</h1>
    <table>
      <tbody>
        <tr>
          <th>Inputs</th>
          <td v-for="(input, i) in inputs" :key="i"><Input :value="input" /></td>
        </tr>
        <tr>
          <th>Outputs</th>
          <td v-for="(output, i) in outputs" :key="i"><Input :value="output" /></td>
        </tr>
      </tbody>
    </table>

    {{ error }}

    <div class="grid">
      <div>
        <h2>Log of inputs</h2>
        <Log :log="log" />
      </div>
      <div>
        <h2>Send midi message</h2>

        <SendMessage :midiOut="outputs?.[0]" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Input from './Input';
import Log from './Log';
import SendMessage from './SendMessage';

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
    const inputs = ref();
    const outputs = ref();
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 0 auto;
  max-width: 1440px;
}

.grid {
  display: grid;
  grid-template-columns: auto auto;
}
</style>
