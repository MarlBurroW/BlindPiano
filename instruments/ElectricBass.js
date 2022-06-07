import ToneElectricBass from "tonejs-instrument-bass-electric-wav";
import BaseInstrument from "./BaseInstrument";
class ElectricBass extends BaseInstrument {
  static id = "electric-bass";
  static label = "🎸 Electric Bass";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneElectricBass({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default ElectricBass;
