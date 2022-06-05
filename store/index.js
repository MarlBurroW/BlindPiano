import Vue from "vue";
import Game from "../classes/Game";

export const state = () => ({
  claimToken: null,
  gameId: null,
  game: null,
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
  storeGame(state, game) {
    if (game) {
      state.game = new Game(game);
      for (let i = 0; i < state.game.players.length; i++) {
        const player = state.game.players[i];

        if (!state.localPlayersSettings[player.id]) {
          Vue.set(state.localPlayersSettings, player.id, {
            visibility: true,
            mute: false,
            volume: 0,
          });
        }
      }
    }
  },
  storeGameId(state, gameId) {
    state.gameId = gameId;
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
export const strict = false;
