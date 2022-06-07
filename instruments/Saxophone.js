import ToneSaxophone from "tonejs-instrument-saxophone-wav";
import BaseInstrument from "./BaseInstrument";
class Saxophone extends BaseInstrument {
  static id = "saxophone";
  static label = "🎷 Saxophone";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneSaxophone({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default Saxophone;
