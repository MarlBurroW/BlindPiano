export const state = () => ({
  claimToken: null,
  gameId: null,
  game: null,
  me: null,
  socket: null,
  chatMessages: [],
  midiDevices: [],
  midiDevice: null,
});

export const mutations = {
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
  storeMidiDevice(state, device) {
    state.midiDevice = device;
  },
};
export const strict = false;
