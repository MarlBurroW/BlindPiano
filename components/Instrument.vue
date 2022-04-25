<template>
  <div></div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import Piano from "../instruments/Piano";
import PolySynth from "../instruments/Polysynth";
import MembraneSynth from "../instruments/MembraneSynth";

import * as Tone from "tone";

import events from "../events";

export default {
  props: {
    eventBus: {
      type: Object,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    instrument: {
      type: String,
      required: true,
    },
    preset: {
      type: String,
    },
    player: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    this.eventBus.on("key-pressed", (payload) => {
      if (
        this.currentInstrument &&
        this.currentInstrument.keyDown &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.keyDown(payload.key);
      }
    });

    this.eventBus.on("key-released", (payload) => {
      if (
        this.currentInstrument &&
        this.currentInstrument.keyUp &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.keyUp(payload.key);
      }
    });

    this.eventBus.on("hold-pedal", (payload) => {
      if (
        this.currentInstrument &&
        this.currentInstrument.holdPedal &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.holdPedal(payload.hold);
      }
    });
  },
  watch: {
    volume: {
      immediate: true,
      handler(db) {
        this.volumeDb = db;
      },
    },
    preset: {
      immediate: true,
      handler(presetId) {
        if (this.currentInstrument.setPresetById) {
          this.currentInstrument.setPresetById(presetId);
        }
      },
    },
  },
  computed: {
    currentInstrument() {
      return this.instruments[this.instrument];
    },

    volumeDb: {
      get() {
        return this.volumeNode.volume.value;
      },
      set(db) {
        this.volumeNode.volume.value = db;
      },
    },
  },
  methods: {},

  data() {
    const volumeNode = new Tone.Volume(0).toDestination();

    const piano = new Piano();
    piano.setVolumeNode(volumeNode);

    const polysynth = new PolySynth();
    polysynth.setVolumeNode(volumeNode);

    const membranesynth = new MembraneSynth();
    membranesynth.setVolumeNode(volumeNode);

    return {
      volumeNode: volumeNode,
      piano: null,
      instruments: {
        piano,
        polysynth,
        membranesynth,
      },
    };
  },
};
</script>

<style>
</style>