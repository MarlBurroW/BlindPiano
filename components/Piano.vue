<template>
  <div>
    <!-- <div v-if="!slider">Total Width: {{ totalWidth }}</div>
    <div v-if="!slider">Visible Width: {{ visibleWidth }}</div> -->
    <div class="piano" :class="{ small: this.small }">
      <div class="keys" ref="keys">
        <div
          :key="midi"
          v-for="(key, midi) in keys"
          :class="`key ${key.pc} ${key.alt == 0 ? 'white-key' : 'black-key'} ${
            key.active ? 'active' : ''
          }`"
          @mousedown="keyMouseDown(key)"
          @mouseup="keyMouseUp(key)"
          @mouseleave="keyMouseUp(key)"
          :style="
            key.active && key.color ? `background: ${key.color} !important` : ``
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Midi, Note } from "@tonaljs/tonal";
import _ from "lodash";
import interact from "interactjs";

export default {
  mounted() {},
  props: {
    small: {
      type: Boolean,
      default: false,
    },
    scrollPosition: {
      type: Number,
      required: false,
    },
  },
  watch: {},
  computed: {},

  methods: {
    getKeyFromMidi(midiKeyCode) {
      const key = this.keys[midiKeyCode];
      return { name: key.name, midi: key.midi };
    },

    startDragArea(e) {
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.effectAllowed = "move";
    },
    emitKeyPressed(key) {
      const keyPayload = { name: key.name, midi: key.midi, velocity: 0.5 };

      this.$emit("key-pressed", keyPayload);
    },
    emitKeyReleased(key) {
      const keyPayload = { name: key.name, midi: key.midi, velocity: 0.5 };

      this.$emit("key-released", keyPayload);
    },

    keyMouseDown(key) {
      this.pressKey(key.midi, 1);
      this.emitKeyPressed(key);
    },

    keyMouseUp(key) {
      if (key.active) {
        this.releaseKey(key.midi);
        this.emitKeyReleased(key);
      }
    },

    pressKey(midiKeyCode, color) {
      const key = this.keys[midiKeyCode];
      if (key) {
        key.color = color;
        key.active = true;
      }
    },
    releaseKey(midiKeyCode) {
      const key = this.keys[midiKeyCode];
      if (key.active) {
        key.active = false;
        key.color = null;
      }
    },

    buildKeys(start, end) {
      const keys = {};
      for (let i = start; i <= end; i++) {
        const key = Note.get(Note.fromMidi(i));
        key.active = false;
        keys[key.midi] = key;
      }

      return keys;
    },
  },

  data() {
    return {
      startOctave: 0,
      displayedOctaves: 9,
      keys: this.buildKeys(21, 108),
    };
  },
};
</script>

<style scoped lang="scss">
.piano {
  position: relative;

  &.small {
    .keys {
      .key {
        border-radius: 0 0 0 0;
        &.white-key {
          height: calc(200px / 4);
          width: calc(50px / 4);
          min-width: calc(50px / 4);
        }

        &.black-key {
          height: calc(125px / 4);
          width: calc(25px / 4);
          min-width: calc(25px / 4);
          left: calc(12.5px / 4);
        }

        &.C,
        &.D,
        &.F,
        &.G,
        &.A {
          margin-right: calc(-25px / 4);
        }
      }
    }
  }
}
.keys {
  display: flex;

  .key {
    color: black;

    &.C,
    &.D,
    &.F,
    &.G,
    &.A {
      margin-right: -25px;
    }

    &.white-key {
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

    &.black-key {
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