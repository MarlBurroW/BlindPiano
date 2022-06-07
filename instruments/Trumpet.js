import ToneTrumpet from "tonejs-instrument-trumpet-wav";
import BaseInstrument from "./BaseInstrument";
class Trumpet extends BaseInstrument {
  static id = "trumpet";
  static label = "🎺 Trumpet";

  constructor() {
    super();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.instrument = new ToneTrumpet({
        onload: () => {
          this.loaded = true;
          resolve(this.instrument);
        },
      });
    });
  }
}

export default Trumpet;
