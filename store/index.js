export const state = () => ({
  claimToken: null,
  gameId: null,
  game: null,
  me: null,
  socket: null,
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
};
