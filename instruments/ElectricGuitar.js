import ToneElectricGuitar from "tonejs-instrument-bass-electric-wav";
import BaseInstrument from "./BaseInstrument";
class ElectricGuitar extends BaseInstrument {
  static id = "electric-guitar";
  static label = "🎸 Electric Guitar";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneElectricGuitar({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default ElectricGuitar;
