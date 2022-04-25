import u from "v-drag";
import PolySynth from "./Polysynth";

const list = [
  {
    name: "Classic Piano",
    id: "piano",
    presets: [],
  },
  {
    name: "PolySynth",
    id: "polysynth",
    presets: PolySynth.getPresets(),
  },
];

export default list;

export function getInstrumentById(id) {
  return list.find((i) => i.id == id);
}

export function getInstrumentNameById(id) {
  const instrument = getInstrumentById(id);
  if (instrument) {
    return instrument.name;
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
      return preset.name;
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
