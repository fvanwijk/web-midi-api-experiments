<template>
  <div class="bg-blue-100 py-6">
    <div class="container">
      <h1 class="text-4xl font-bold mb-8">🎹 Web MIDI API Experiments</h1>
      <table class="mt-4">
        <tbody>
          <tr>
            <th>Inputs</th>
            <td>
              <Select
                type="input"
                :options="inputOptions"
                :value="selectedIn"
                @input="selectedIn = $event.target.value"
              />
            </td>
          </tr>
          <tr>
            <th>Outputs</th>
            <td>
              <Select
                type="output"
                :options="outputOptions"
                :value="selectedOut"
                @input="selectedOut = $event.target.value"
              />
            </td>
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
        <SendMessage :selectedOutput="selectedOutput" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import Log from './components/Log';
import Select from './components/Select';
import SendMessage from './components/SendMessage';

export default {
  name: 'Devices',
  components: { Log, Select, SendMessage },
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

    const inputs = ref([{ name: 'a', state: 'connected' }, { name: 'b' }]);
    const inputOptions = computed(() => Array.from(inputs.value)); // .values()
    const selectedIn = ref();
    const selectedInput = computed(() => inputs.value.find(o => o.name === selectedIn.value));

    const outputs = ref([{ name: 'x' }, { name: 'y' }]);
    const outputOptions = computed(() => Array.from(outputs.value)); // .values()
    const selectedOut = ref();
    const selectedOutput = computed(() => outputs.value.find(o => o.name === selectedOut.value));

    const log = ref([]);

    onMounted(async () => {
      try {
        const res = await connect();

        //inputs.value = res.inputs;
        for (let input of res.inputs.values()) {
          input.addEventListener('midimessage', e => {
            log.value.push(e);
          });
        }

        //outputs.value = res.outputs.values();
      } catch (e) {
        console.log(e);
        error.value = 'Could not get MIDI access';
      }
    });

    return {
      connect,
      error,
      inputs,
      inputOptions,
      log,
      outputs,
      outputOptions,
      selectedIn,
      selectedInput,
      selectedOut,
      selectedOutput,
    };
  },
};
</script>
