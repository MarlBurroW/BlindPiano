import { WebMidi } from "webmidi";

export default async (app, inject) => {
  await WebMidi.enable()
    .then(() => {
      console.log("Web Midi Api Enabled !");
    })
    .catch((err) => {
      console.log(err);
    });

  app.store.commit("storeMidiDevices", WebMidi.inputs);

  if (!app.store.state.midiDevice && WebMidi.inputs.length > 0) {
    app.store.commit("storeMidiDevice", WebMidi.inputs[0]);
  }

  WebMidi.addListener("portschanged", () => {
    app.store.commit("storeMidiDevices", WebMidi.inputs);

    if (!app.store.state.midiDevice && WebMidi.inputs.length > 0) {
      app.store.commit("storeMidiDevice", WebMidi.inputs[0]);
    }
  });

  inject("webMidi", WebMidi);
};
