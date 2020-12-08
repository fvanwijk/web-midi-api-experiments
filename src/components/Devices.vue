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
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import Input from './Input';

export default {
  name: 'Devices',
  components: { Input },
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

    onMounted(async () => {
      try {
        const res = await connect();
        inputs.value = Array.from(res.inputs.values());
        console.log(inputs.value[0]);
        outputs.value = Array.from(res.outputs.values());
      } catch (e) {
        error.value = 'Could not get MIDI access';
      }
    });

    return { connect, error, inputs, outputs };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin: 0 auto;
  max-width: 800px;
}
</style>
