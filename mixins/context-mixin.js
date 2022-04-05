export default {
  computed: {
    me: {
      set(me) {
        this.$store.commit("storeMe", me);
      },
      get() {
        return this.$store.state.me;
      },
    },
    game: {
      set(game) {
        this.$store.commit("storeGame", game);
      },
      get() {
        return this.$store.state.game;
      },
    },
    claimToken: {
      set(claimToken) {
        this.$store.commit("storeClaimToken", claimToken);
      },
      get() {
        return this.$store.state.claimToken;
      },
    },
    gameId: {
      set(gameId) {
        this.$store.commit("storeGameId", gameId);
      },
      get() {
        return this.$store.state.gameId;
      },
    },
    gameState() {
      return this.game ? this.game.state : null;
    },

    socket() {
      return this.$getSocketInstance();
    },
    isLeader() {
      return this.me && this.game && this.me.id === this.game.leaderId;
    },
  },
  methods: {},
};
