<template>
  <div>
    <MidiDeviceSelection></MidiDeviceSelection>
    <Piano
      ref="piano"
      @key-pressed="keyPressed"
      @key-released="keyReleased"
    ></Piano>
  </div>
</template>

<script>
import { Piano } from "@tonejs/piano";
import events from "../events";
import contextMixin from "../mixins/context-mixin";
export default {
  mixins: [contextMixin],
  mounted() {
    this.piano = new Piano({
      velocities: 3,
    }).toDestination();

    this.piano.load().then(() => {
      console.log("loaded!");
    });

    if (this.midiDevice) {
      this.midiDevice.addListener("noteon", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.pressKey(e.note.number, e.note.attack);
        }
      });

      this.midiDevice.addListener("noteoff", (e) => {
        if (this.$refs.piano) {
          this.$refs.piano.releaseKey(e.note.number);
        }
      });
    }

    this.socket.on(events.KEY_PRESSED, (key) => {
      this.$refs.piano.pressKey(key.number, key.velocity, true);
    });

    this.socket.on(events.KEY_RELEASED, (key) => {
      this.$refs.piano.releaseKey(key.number, true);
    });
  },
  computed: {},
  methods: {
    keyPressed({ key, velocity, preventEmit }) {
      this.piano.keyDown({ note: key.name, velocity });
      if (!preventEmit) {
        this.socket.emit(events.KEY_PRESSED, {
          number: key.midi,
          note: key.name,
          velocity,
        });
      }
    },
    keyReleased({ key, preventEmit }) {
      this.piano.keyUp({ note: key.name });

      if (!preventEmit) {
        this.socket.emit(events.KEY_RELEASED, {
          number: key.midi,
          note: key.name,
        });
      }
    },
  },
  data() {
    return {
      piano: null,
    };
  },
};
</script>

<style>
</style>