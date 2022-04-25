import * as Tone from "tone";
class PolySynth {
  constructor() {
    this.id = "membranesynth";
    this.volumeNode = null;
    this.instrument = new Tone.MembraneSynth();
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
}

export default PolySynth;
