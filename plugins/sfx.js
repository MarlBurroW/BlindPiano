import Vue from "vue";
import * as Tone from "tone";

let latestPlayTime = 0;

export default (app, inject) => {
  const sounds = {
    "new-player": new Tone.Player("/sfx/new-player.mp3"),
    "player-disconnect": new Tone.Player("/sfx/player-disconnect.mp3"),
    success: new Tone.Player("/sfx/success.mp3"),
    tic: new Tone.Player("/sfx/tic.mp3"),
    start: new Tone.Player("/sfx/start.mp3"),
  };

  const sfxVolumeNode = new Tone.Volume(0);

  for (const key in sounds) {
    if (Object.hasOwnProperty.call(sounds, key)) {
      const sound = sounds[key];

      sound.connect(sfxVolumeNode);
    }
  }

  inject("connectSFX", (volumeNode) => {
    sfxVolumeNode.connect(volumeNode);
  });

  inject("playSFX", (sfxId) => {
    let now = Tone.now();

    if (latestPlayTime === now) {
      now += 0.001;
    }

    latestPlayTime = now;

    sounds[sfxId].start(now);
  });
};
