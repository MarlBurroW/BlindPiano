import Vue from "vue";

import newPlayer from "../assets/sounds/new-player.mp3";
import playerDisconnect from "../assets/sounds/player-disconnect.mp3";
import success from "../assets/sounds/success.mp3";
import tic from "../assets/sounds/tic.mp3";
import start from "../assets/sounds/start.mp3";

export default async (app, inject) => {
  const sounds = {
    "new-player": new Audio(newPlayer),
    "player-disconnect": new Audio(playerDisconnect),
    success: new Audio(success),
    tic: new Audio(tic),
    start: new Audio(start),
  };

  inject("playSFX", (sfxId) => {
    sounds[sfxId].play();
  });
};
