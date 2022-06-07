import PolySynth from "./Polysynth";
import Piano from "./Piano";
import ElectricBass from "./ElectricBass";
import ElectricGuitar from "./ElectricGuitar";
import HighQualityPiano from "./HighQualityPiano";
import Violin from "./Violin";
import Saxophone from "./Saxophone";
import Trumpet from "./Trumpet";
import AcousticGuitar from "./AcousticGuitar";

const list = [
  Piano,
  ElectricBass,
  ElectricGuitar,
  AcousticGuitar,
  Violin,
  Saxophone,
  Trumpet,

  HighQualityPiano,
];

export default list;

export function getInstrumentById(id) {
  return list.find((i) => i.id == id);
}

export function getInstrumentNameById(id) {
  const instrument = getInstrumentById(id);
  if (instrument) {
    return instrument.label;
  } else {
    return null;
  }
}

export function getPresetById(instrumentId, presetId) {
  const instrument = getInstrumentById(instrumentId);
  if (instrument && instrument.presets) {
    const preset = instrument.presets.find((p) => p.id == presetId);
    if (preset) return preset;
    else return null;
  } else return null;
}

export function getPresetNameById(instrumentId, presetId) {
  const instrument = getInstrumentById(instrumentId);
  if (instrument && instrument.presets) {
    const preset = getPresetById(instrument.id, presetId);
    if (preset) {
      return preset.label;
    }
  }
  return null;
}

export function getInstrumentAndPresetNameById(instrumentId, presetId) {
  return [
    getInstrumentNameById(instrumentId),
    getPresetNameById(instrumentId, presetId),
  ]
    .filter((n) => !!n)
    .join(" - ");
}
