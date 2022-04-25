import Vue from "vue";

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
});

export const mutations = {
  storeLeftDrawer(state, leftDrawer) {
    state.leftDrawer = leftDrawer;
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
    state.game = game;

    if (game) {
      for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];

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
