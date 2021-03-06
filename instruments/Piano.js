import TonePiano from "tonejs-instrument-piano-wav";
import BaseInstrument from "./BaseInstrument";
class Piano extends BaseInstrument {
  static id = "piano";
  static label = "🎹 Piano";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new TonePiano({
        onload: () => {
          this.loaded = true;

          resolve(this.instrument);
        },
      });
    });
  }
}

export default Piano;
