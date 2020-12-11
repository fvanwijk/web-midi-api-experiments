<template>
  <select :disabled="empty" :value="value">
    <option v-if="empty">No {{ type }}s detected</option>
    <option v-for="(option, i) in options" :key="i" :value="option.name">
      {{ option.state === 'connected' ? '🟢' : '🔴' }} {{ option.name }}
    </option>
  </select>
</template>
<script>
import { computed, onMounted } from 'vue';

export default {
  name: 'Select',
  props: ['options', 'type', 'value'],
  setup(props, { emit }) {
    return {
      empty: computed(() => !props.options?.length),
      onMounted: onMounted(() => {
        if (props.options.length) {
          emit('input', { target: { value: props.options[0].name } });
        }
      }),
    };
  },
};
</script>
<style scoped>
.state {
  margin-left: 0.5rem;
}
.connected {
  color: green;
}
</style>
