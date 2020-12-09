<template>
  <div>
    <p v-if="!log.length" class="italic">No logs yet</p>
    <LogLine v-for="(line, i) in log" :key="i" :event="line" />
  </div>
</template>
<script>
import LogLine from './LogLine';

export default {
  name: 'Log',
  components: { LogLine },
  props: ['log'],
};
</script>
