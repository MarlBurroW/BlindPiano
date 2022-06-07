import { Piano as tonjejsPiano } from "@tonejs/piano";
import BaseInstrument from "./BaseInstrument";
class HighQualityPiano extends BaseInstrument {
  static id = "high-quality-piano";
  static label = "🎹 High Quality Piano";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new tonjejsPiano({
        url: "/samples/piano",
        velocities: 5,
        pedal: true,
        release: true,
      });

      this.instrument.load().then(() => {
        this.loaded = true;
        resolve(this.instrument);
      });
    });
  }

  keyDown(key) {
    if (this.instrument) {
      this.instrument.keyDown({ note: key.name, velocity: key.velocity });
    }
  }
  keyUp(key) {
    if (this.instrument) {
      this.instrument.keyUp({ note: key.name });
    }
  }
  holdPedal(hold) {
    if (this.instrument) {
      if (hold) {
        this.instrument.pedalDown();
      } else {
        this.instrument.pedalUp();
      }
    }
  }
}

export default HighQualityPiano;
