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
};
export const strict = false;
