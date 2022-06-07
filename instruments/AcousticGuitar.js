import ToneAcousticGuitar from "tonejs-instrument-guitar-acoustic-wav";
import BaseInstrument from "./BaseInstrument";
class AcousticGuitar extends BaseInstrument {
  static id = "acoustic-guitar";
  static label = "🎸 Acoustic Guitar";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneAcousticGuitar({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default AcousticGuitar;
