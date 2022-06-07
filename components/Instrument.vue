<template></template>

<script>
import instrumentList from "../instruments/list";
import * as Tone from "tone";

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

    masterVolume: {
      type: Object,
      required: true,
    },
  },

  mounted() {
    const instruments = {};
    for (let i = 0; i < instrumentList.length; i++) {
      const InstrumentClass = instrumentList[i];
      const instrumentInstance = new InstrumentClass();

      instruments[InstrumentClass.id] = instrumentInstance;
    }

    this.instruments = instruments;

    this.eventBus.on("key-pressed", this.onKeyPressed);
    this.eventBus.on("key-released", this.onKeyReleased);
    this.eventBus.on("hold-pedal", this.onHoldPedal);
    this.eventBus.on("reset", this.onReset);
  },

  beforeDestroy() {
    this.eventBus.off("key-pressed", this.onKeyPressed);
    this.eventBus.off("key-released", this.onKeyReleased);
    this.eventBus.off("hold-pedal", this.onHoldPedal);
    this.eventBus.off("reset", this.onReset);

    for (const key in this.instruments) {
      if (Object.hasOwnProperty.call(this.instruments, key)) {
        const instrument = this.instruments[key];

        instrument.destroy();
      }
    }
  },

  watch: {
    currentInstrument: {
      immediate: true,
      handler(instrument) {
        if (instrument && !instrument.isLoaded()) {
          instrument.load().then(() => {
            instrument.connect(this.volumeNode);
          });
        }
      },
    },

    volume: {
      immediate: true,
      handler(db) {
        this.volumeDb = db;
      },
    },
    preset: {
      immediate: false,
      handler(presetId) {
        if (this.currentInstrument.setPresetById) {
          this.currentInstrument.setPresetById(presetId);
        }
      },
    },
  },
  computed: {
    currentInstrument() {
      if (this.instruments) {
        return this.instruments[this.instrument];
      }
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
  methods: {
    onKeyPressed(payload) {
      if (
        this.currentInstrument &&
        this.currentInstrument.keyDown &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.keyDown(payload.key);
      }
    },
    onKeyReleased(payload) {
      if (
        this.currentInstrument &&
        this.currentInstrument.keyUp &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.keyUp(payload.key);
      }
    },
    onHoldPedal(payload) {
      if (
        this.currentInstrument &&
        this.currentInstrument.holdPedal &&
        payload.from === this.player.id
      ) {
        this.currentInstrument.holdPedal(payload.hold);
      }
    },
    onReset() {
      for (const instkey in this.instruments) {
        if (Object.hasOwnProperty.call(this.instruments, instkey)) {
          const instrument = this.instruments[instkey];

          instrument.reset();
        }
      }
    },
  },

  data() {
    const volumeNode = new Tone.Volume(0);

    volumeNode.connect(this.masterVolume);

    return {
      volumeNode: volumeNode,
      piano: null,
      instruments: null,
    };
  },
};
</script>

<style>
</style>