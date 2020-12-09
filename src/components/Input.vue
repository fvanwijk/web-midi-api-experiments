<template>
  <select :disabled="empty">
    <option v-if="empty">No {{ type }}s detected</option>
    <option v-for="(value, i) in values" :key="i">
      {{ value.state === 'connected' ? '🟢' : '🔴' }} {{ value.name }}
    </option>
  </select>
</template>
<script>
import { computed } from 'vue';

export default {
  name: 'Input',
  props: ['values', 'type'],
  setup(props) {
    return { empty: computed(() => !props.values?.length) };
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
