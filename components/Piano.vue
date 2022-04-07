<template>
  <div class="piano">
    <div class="keys" v-dragscroll>
      <div
        :key="key.midi"
        v-for="key in visibleKeys"
        :class="`key ${key.pc} ${key.alt == 0 ? 'white' : 'black'} ${
          key.active ? 'active' : ''
        }`"
        @mousedown="keyMouseDown(key)"
        @mouseup="keyMouseUp(key)"
        @mouseleave="keyMouseUp(key)"
      ></div>
    </div>
  </div>
</template>

<script>
import { Midi, Note } from "@tonaljs/tonal";
import _ from "lodash";
export default {
  computed: {
    test() {
      return Note.get("C4");
    },
    endOctave() {
      return this.startOctave + this.displayedOctaves;
    },

    visibleKeys() {
      return this.keys.filter((key) => {
        return key.oct >= this.startOctave && key.oct < this.endOctave;
      });
    },

    indexedKeys() {
      const keys = {};
      for (let i = 0; i < this.keys.length; i++) {
        const key = this.keys[i];
        keys[key.midi] = key;
      }
      return keys;
    },
  },

  methods: {
    keyMouseDown(key) {
      this.pressKey(key.midi, 1);
    },

    keyMouseUp(key) {
      this.releaseKey(key.midi);
    },

    pressKey(midiKeyNumber, velocity, preventEmit) {
      const key = this.indexedKeys[midiKeyNumber];
      key.active = true;

      this.$emit("key-pressed", { key, velocity, preventEmit });
    },
    releaseKey(midiKeyNumber, preventEmit) {
      const key = this.indexedKeys[midiKeyNumber];
      if (key.active) {
        key.active = false;

        this.$emit("key-released", { key, preventEmit });
      }
    },

    buildKeys() {
      const keys = [];
      for (let i = 21; i <= 108; i++) {
        const key = Note.get(Note.fromMidi(i));
        key.active = false;
        keys.push(key);
      }

      return keys;
    },
  },

  data() {
    return {
      startOctave: 0,
      displayedOctaves: 9,
      keys: this.buildKeys(),
    };
  },
};
</script>

<style scoped lang="scss">
.piano {
  width: 100%;
}
.keys {
  width: 100%;
  display: flex;
  overflow-y: scroll;
  .key {
    color: black;

    &.C,
    &.D,
    &.F,
    &.G,
    &.A {
      margin-right: -25px;
    }

    &.white {
      height: 200px;
      width: 50px;
      min-width: 50px;
      z-index: 1;
      border-left: 1px solid #bbb;
      border-bottom: 1px solid #bbb;
      border-radius: 0 0 5px 5px;
      box-shadow: -1px 0 0 rgba(255, 255, 255, 0.8) inset, 0 0 5px #ccc inset,
        0 0 3px rgba(0, 0, 0, 0.2);
      background: linear-gradient(to bottom, #eee 0%, #fff 100%);
      transition: box-shadow ease 0.1s, background ease 0.1s, border ease 0.1s;
      &.active {
        border: none;
        box-shadow: 2px 0 3px rgba(0, 0, 0, 0.1) inset,
          -5px 5px 20px rgba(0, 0, 0, 0.8) inset, 0 0 3px rgba(0, 0, 0, 0.2);

        background: linear-gradient(to bottom, #fff 0%, #e9e9e9 100%);
      }
    }

    &.black {
      height: 125px;
      width: 25px;
      min-width: 25px;
      position: relative;
      left: 12.5px;
      z-index: 2;
      border: 1px solid #000;
      border-radius: 0 0 3px 3px;
      transition: box-shadow ease 0.1s, background ease 0.1s, border ease 0.1s;
      box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
        0 -5px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 2px 4px rgba(0, 0, 0, 0.5);
      background: linear-gradient(45deg, #222 0%, #555 100%);

      &.active {
        box-shadow: -1px -1px 2px rgba(255, 255, 255, 0.2) inset,
          0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5);
        background: linear-gradient(to right, #444 0%, #222 100%);
      }
    }
  }
}
</style>