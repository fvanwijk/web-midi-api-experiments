<template>
  <div><LogLine v-for="(line, i) in log" :key="i" :event="line" /></div>
</template>
<script>
import LogLine from './LogLine';

export default {
  name: 'Log',
  components: { LogLine },
  props: ['log'],
};
</script>
