import _ from "lodash";
import * as Tone from "tone";
class PolySynth {
  constructor() {
    this.id = "polysynth";
    this.volumeNode = null;
    this.preset = this.constructor.getPresets()[0];
    this.createInstrument();
  }
  createInstrument() {
    if (this.instrument) {
      this.instrument.disconnect();
      this.instrument.dispose();
    }

    this.instrument = new Tone.PolySynth();

    if (this.preset) {
      this.instrument.set(this.preset.content);
    }

    if (this.volumeNode) {
      this.instrument.connect(this.volumeNode);
    }
  }

  setVolumeNode(volumeNode) {
    this.volumeNode = volumeNode;
    this.instrument.connect(this.volumeNode);
  }

  keyDown(key) {
    this.instrument.triggerAttack(key.name, key.velocity);
  }
  keyUp(key) {
    this.instrument.triggerRelease(key.name);
  }

  setPresetById(presetId) {
    const presets = this.constructor.getPresets();
    const preset = presets.find((p) => p.id === presetId);

    this.preset = preset;
    this.instrument.set(Tone.PolySynth.getDefaults());
    this.instrument.set(preset.content);
  }
  reset() {
    this.createInstrument();
  }
  destroy() {
    this.instrument.dispose();
  }
  static getPresets() {
    return [
      {
        name: "Super Saw",
        id: "supersaw",
        content: {
          oscillator: {
            type: "fatsawtooth",
            count: 3,
            spread: 30,
          },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0.5,
            release: 0.4,
            attackCurve: "exponential",
          },
        },
      },
      {
        name: "Alien Chorus",
        id: "alienchorus",
        content: {
          oscillator: {
            type: "fatsine4",
            spread: 60,
            count: 10,
          },
          envelope: {
            attack: 0.4,
            decay: 0.01,
            sustain: 1,
            attackCurve: "sine",
            releaseCurve: "sine",
            release: 0.4,
          },
        },
      },
      {
        name: "Delicate Wind Part",
        id: "delicatewindpart",
        content: {
          portamento: 0.0,
          oscillator: {
            type: "square4",
          },
          envelope: {
            attack: 2,
            decay: 1,
            sustain: 0.2,
            release: 2,
          },
        },
      },
      {
        name: "Drop Pulse",
        id: "droppulse",
        content: {
          oscillator: {
            type: "pulse",
            width: 0.8,
          },
          envelope: {
            attack: 0.01,
            decay: 0.05,
            sustain: 0.2,
            releaseCurve: "bounce",
            release: 0.4,
          },
        },
      },
      {
        name: "Letric",
        id: "letric",
        content: {
          portamento: 0.2,
          oscillator: {
            type: "sawtooth",
          },
          envelope: {
            attack: 0.03,
            decay: 0.1,
            sustain: 0.2,
            release: 0.02,
          },
        },
      },
      {
        name: "TreeTunk",
        id: "treetunk",
        content: {
          oscillator: {
            type: "sine",
          },
          envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.1,
            release: 1.2,
          },
        },
      },
    ];
  }
}

export default PolySynth;
