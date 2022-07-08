import Vue from "vue";
import Game from "../classes/Game";
export const state = () => ({
  claimToken: null,
  gameId: null,
  gameData: null,
  me: null,
  privateTurnInfo: null,
  socket: null,
  chatMessages: [],
  midiDevices: [],
  midiDevice: null,
  leftDrawer: true,
  rightDrawer: true,
  instrument: "piano",
  preset: null,
  localPlayersSettings: {},
  showKeyboard: true,
  masterVolume: 0,
});

export const mutations = {
  storeMasterVolume(state, masterVolume) {
    state.masterVolume = masterVolume;
  },
  storeLeftDrawer(state, leftDrawer) {
    state.leftDrawer = leftDrawer;
  },
  storeShowKeyboard(state, showKeyboard) {
    state.showKeyboard = showKeyboard;
  },

  storeRightDrawer(state, rightDrawer) {
    state.rightDrawer = rightDrawer;
  },

  storeClaimToken(state, claimToken) {
    state.claimToken = claimToken;
  },
  storeMe(state, me) {
    state.me = me;
  },
  storeGameData(state, gameData) {
    state.gameData = gameData;

    if (gameData) {
      for (let i = 0; i < state.gameData.persons.length; i++) {
        const player = state.gameData.persons[i];

        if (player.id === state.me.id) {
          state.me = player;
        }

        if (!state.localPlayersSettings[player.id]) {
          Vue.set(state.localPlayersSettings, player.id, {
            visibility: true,
            mute: false,
            volume: 0,
            loadingInstrument: false,
          });
        }
      }
    }
  },
  storeGameId(state, gameId) {
    state.gameId = gameId;
  },

  storeCountDown(state, countDown) {
    state.gameData.state.countDown = countDown;
  },

  addChatMessage(state, message) {
    state.chatMessages.push(message);
  },
  storeMidiDevices(state, devices) {
    state.midiDevices = devices;
  },

  storePrivateTurnInfo(state, turnInfo) {
    state.privateTurnInfo = turnInfo;
  },

  storeMidiDevice(state, device) {
    if (state.midiDevice) {
      state.midiDevice.removeListener();
    }

    state.midiDevice = device;
  },
  storeInstrument(state, instrument) {
    state.instrument = instrument;
  },
  storePreset(state, preset) {
    state.preset = preset;
  },

  storeLocalPlayerSetting(state, { playerId, prop, value }) {
    state.localPlayersSettings[playerId][prop] = value;
  },
};

let game = null;

export const getters = {
  gameInstance(state) {
    if (!game) {
      if (state.gameData) {
        game = new Game(state.gameData);
      }
    } else {
      if (state.gameData) {
        game.setGameData(state.gameData);
      }
    }
    return game;
  },
};

export const strict = false;
