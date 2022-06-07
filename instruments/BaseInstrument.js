import * as Tone from "tone";
class BaseInstrument {
  constructor() {
    this.loaded = false;
  }

  connect(node) {
    if (this.instrument) {
      this.instrument.connect(node);
    }
  }

  isLoaded() {
    return this.loaded;
  }

  keyDown(key) {
    if (this.instrument && this.loaded) {
      this.instrument.triggerAttack(key.name, Tone.immediate(), key.velocity);
    }
  }
  keyUp(key) {
    if (this.instrument && this.loaded) {
      this.instrument.triggerRelease(key.name, Tone.immediate());
    }
  }

  holdPedal(hold) {}
  reset() {}

  load() {
    return new Promise((resolve) => {
      resolve();
    });
  }

  destroy() {
    if (this.instrument) {
      this.instrument.disconnect();
      this.instrument.dispose();
      this.instrument = null;
    }
  }
}

export default BaseInstrument;
