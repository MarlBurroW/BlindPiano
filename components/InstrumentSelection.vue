<template>
  <div class="d-flex">
    <v-select
      placeholder="Select your instrument"
      outlined
      hide-details
      item-value="id"
      item-text="label"
      :items="instruments"
      :value="instrument"
      class="mr-3"
      @input="$emit('update:instrument', $event)"
    >
    </v-select>

    <v-select
      v-if="currentInstrumentPresets.length > 0"
      placeholder="Select your preset"
      outlined
      hide-details
      :items="currentInstrumentPresets"
      :value="preset"
      item-text="name"
      item-value="id"
      @input="$emit('update:preset', $event)"
    >
    </v-select>
  </div>
</template>

<script>
import PolySynth from "../instruments/Polysynth";
import list from "../instruments/list";

export default {
  props: {
    instrument: {
      type: String,
    },
    preset: {
      type: String,
    },
  },
  mounted() {},
  watch: {
    instrument: {
      immediate: true,
      handler() {
        if (this.currentInstrumentPresets.length > 0 && !this.preset) {
          this.$emit("update:preset", this.currentInstrumentPresets[0].id);
        }
      },
    },
  },
  computed: {
    currentInstrumentPresets() {
      const instrument = this.instruments.find((i) => i.id == this.instrument);

      if (instrument && instrument.presets && instrument.presets.length > 0) {
        return instrument.presets;
      } else return [];
    },
  },
  methods: {},
  data() {
    return {
      selectedInstrument: null,
      selectedPreset: null,
      instruments: list,
    };
  },
};
</script>

<style>
</style>