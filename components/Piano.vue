<template>
  <div>
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
          @mouseenter="onMouseEnter(key, $event)"
          @mouseleave="onMouseLeave(key, $event)"
          :style="
            key.active && key.color ? `background: ${key.color} !important` : ``
          "
        >
          <div
            class="keyboard-key"
            v-if="getKeyboardKeyFromKey(key) && showKeyboardCaption"
          >
            {{ getKeyboardKeyFromKey(key) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Midi, Note } from "@tonaljs/tonal";
import _ from "lodash";

export default {
  components: {},
  mounted() {
    window.addEventListener("keydown", this.onKeyboardKeyDown);
    window.addEventListener("keyup", this.onKeyboardKeyUp);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeyboardKeyDown);
    window.removeEventListener("keyup", this.onKeyboardKeyUp);
  },
  props: {
    showKeyboardCaption: {
      type: Boolean,
      default: false,
    },
    keyboardOctave: {
      type: Number,
      default: 3,
    },
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
    getKeyboardKeyFromKey(key) {
      const midiKeyCode = key.midi - this.keyboardOctave * 12;

      for (const keycode in this.keyboardMidiMapping) {
        if (Object.hasOwnProperty.call(this.keyboardMidiMapping, keycode)) {
          const midicode = this.keyboardMidiMapping[keycode];

          if (midicode == midiKeyCode) {
            return String.fromCharCode(keycode);
          }
        }
      }

      return null;
    },

    getKeyFromKeyboardKeyCode(keycode) {
      if (this.keyboardMidiMapping[keycode]) {
        return this.keys[
          this.keyboardMidiMapping[keycode] + this.keyboardOctave * 12
        ];
      }

      return null;
    },
    onKeyboardKeyDown(e) {
      const keycode = e.keyCode;
      const key = this.getKeyFromKeyboardKeyCode(keycode);
      if (key) {
        this.pressKey(key.midi, 1);
        this.emitKeyPressed(key);
      }
    },
    onKeyboardKeyUp(e) {
      const keycode = e.keyCode;
      const key = this.getKeyFromKeyboardKeyCode(keycode);
      if (key) {
        this.releaseKey(key.midi);
        this.emitKeyReleased(key);
      }
    },
    onMouseEnter(key, event) {
      if (event.buttons == 1) {
        this.pressKey(key.midi, 1);
        this.emitKeyPressed(key);
      }
    },
    onMouseLeave(key, event) {
      this.releaseKey(key.midi);
      this.emitKeyReleased(key);
    },
    getKeyFromMidi(midiKeyCode) {
      const key = this.keys[midiKeyCode];

      return key ? { name: key.name, midi: key.midi } : null;
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
    resetKeys() {
      for (const midiCode in this.keys) {
        if (Object.hasOwnProperty.call(this.keys, midiCode)) {
          const key = this.keys[midiCode];
          key.active = false;
        }
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
      keyboardMidiMapping: {
        81: 24, // C
        90: 25, // C#
        83: 26, // D
        69: 27, // D#
        68: 28, // E
        70: 29, // F
        84: 30, // F#
        71: 31, // G
        89: 32, // G#
        72: 33, // A
        85: 34, // A#
        74: 35, // B
        75: 36, // C2
        79: 37, // C2#
        76: 38, // D2
        80: 39, // D2#
        77: 40, // E2
      },
      keyboardKeys: [
        {
          keyCode: 65,
        },
      ],
      keys: this.buildKeys(21, 108),
    };
  },
};
</script>

<style scoped lang="scss">
.piano {
  position: relative;
  .keyboard-key {
    background-color: #2196f3;
    color: white;
    padding: 5px 15px;
    border-radius: 3px;
    margin-bottom: 5px;
    font-weight: 700;
    font-size: 20px;
  }
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
    display: flex;
    justify-content: center;
    align-items: flex-end;
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
      border-radius: 0 0 0 0;
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