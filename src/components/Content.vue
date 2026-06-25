<template>
  <div style="position: relative;">
    <TempVarChart :tempVar="tempVar" />
    <Highlights :highlights="highlights" />
  </div>
</template>

<script>
import TempVarChart from './TempVarChart.vue';
import Highlights from './Highlights.vue';

/**
 * "Dumb" component that exists purely to maintain the component hierarchy
 * described in the original tutorial — it relays `highlights` and
 * `tempVar` from App.vue down to its two children without modification.
 */
export default {
  name: 'Content',
  components: { TempVarChart, Highlights },
  props: {
    highlights: {
      type: Object,
      required: true,
    },
    tempVar: {
      type: Object,
      required: true,
    },
  },
};
</script>
