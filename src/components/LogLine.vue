<template>
  <div>
    🎧 <strong>{{ cmd }}</strong> - pitch: {{ pitch }}, velocity: {{ velocity }}
  </div>
</template>
<script>
const NOTE_ON = 0x90;
const NOTE_OFF = 0x80;

export default {
  name: 'LogLine',
  props: ['event'],
  computed: {
    cmd() {
      return { [NOTE_ON]: 'Note on', [NOTE_OFF]: 'Note off' }[this.event.data[0]];
    },
    pitch() {
      return this.event.data[1];
    },
    velocity() {
      return this.event.data.length > 2 ? this.event.data[2] : 1;
    },
  },
};
</script>
<style>
strong {
  font-weight: bold;
}
</style>
