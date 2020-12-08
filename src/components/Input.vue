<template>
  <div>
    <em>{{ value.name }}</em>
    <span :class="{ state: true, connected: value.state === 'connected' }">{{ value.state }}</span>
  </div>
</template>
<script>
export default {
  name: 'Input',
  props: ['value'],
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
