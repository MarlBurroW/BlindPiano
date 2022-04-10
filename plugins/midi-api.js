import { WebMidi } from "webmidi";

export default async (app, inject) => {
  await WebMidi.enable()
    .then(() => {
      console.log("Web Midi Api Enabled !");
    })
    .catch((err) => {
      console.log(err);
    });

  inject("webMidi", WebMidi);
};
