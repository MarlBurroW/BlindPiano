import { Piano as tonjejsPiano } from "@tonejs/piano";

class Piano {
  constructor() {
    this.id = "piano";
    this.volumeNode = null;
    this.createInstrument();
  }
  createInstrument() {
    if (this.instrument) {
      this.instrument.disconnect();
      this.instrument.dispose();
    }

    this.instrument = new tonjejsPiano({
      velocities: 5,
      volume: {
        pedal: -20,
        strings: -20,
        keybed: -20,
        harmonics: -20,
      },
    });

    this.instrument.load().then(() => {
      console.log("Piano loaded");
    });
  }
  setVolumeNode(volumeNode) {
    this.volumeNode = volumeNode;
    this.instrument.connect(this.volumeNode);
  }

  keyDown(key) {
    this.instrument.keyDown({ note: key.name, velocity: key.velocity });
  }
  keyUp(key) {
    this.instrument.keyUp({ note: key.name });
  }
  holdPedal(hold) {
    if (hold) {
      this.instrument.pedalDown();
    } else {
      this.instrument.pedalUp();
    }
  }
  reset() {}

  destroy() {
    this.instrument.dispose();
  }
}

export default Piano;
