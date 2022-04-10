<template>
  <div></div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import { Piano } from "@tonejs/piano";
import * as Tone from "tone";

import events from "../events";

export default {
  mixins: [contextMixin],

  props: {
    eventBus: {
      type: Object,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
  },

  mounted() {
    const piano = new Piano({
      velocities: 5,
      volume: {
        pedal: -20,
        strings: -20,
        keybed: -20,
        harmonics: -20,
      },
    });

    piano.load().then(() => {
      console.log("loaded!");
    });

    piano.connect(this.volumeNode);

    this.eventBus.on("key-pressed", (key) => {
      piano.keyDown({ note: key.name, velocity: key.velocity });
    });
    this.eventBus.on("key-released", (key) => {
      piano.keyUp({ note: key.name });
    });

    this.socket.on(events.KEY_PRESSED, (key) => {
      piano.keyDown({ note: key.name, velocity: key.velocity });
    });

    this.socket.on(events.KEY_RELEASED, (key) => {
      piano.keyUp({ note: key.name });
    });

    this.piano = piano;
  },
  watch: {
    volume: {
      immediate: true,
      handler(db) {
        this.volumeDb = db;
      },
    },
  },
  computed: {
    volumeDb: {
      get() {
        return this.volumeNode.volume.value;
      },
      set(db) {
        this.volumeNode.volume.value = db;
      },
    },
  },
  data() {
    return {
      volumeNode: new Tone.Volume(0).toDestination(),
      piano: null,
    };
  },
};
</script>

<style>
</style>