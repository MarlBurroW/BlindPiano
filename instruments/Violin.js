import ToneViolin from "tonejs-instrument-violin-wav";
import BaseInstrument from "./BaseInstrument";
class Violin extends BaseInstrument {
  static id = "violin";
  static label = "🎻 Violin";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneViolin({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default Violin;
