<template>
  <v-select
    hide-details
    placeholder="Select your midi device"
    label="Midi Device"
    outlined
    :items="deviceItems"
    :value="midiDevice ? midiDevice.id : null"
    return-object
    @input="
      ($event) => {
        $store.commit('storeMidiDevice', $event.device);
      }
    "
  ></v-select>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
  mounted() {},
  computed: {
    deviceItems() {
      return [
        { text: "None", value: null },
        ...this.midiDevices.map((d) => {
          return {
            text: `${d.name}`,
            value: d.id,
            device: d,
          };
        }),
      ];
    },
  },
  methods: {},

  data() {
    return {
      devices: [],
    };
  },
};
</script>

<style>
</style>