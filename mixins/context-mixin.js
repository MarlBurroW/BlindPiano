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
    midiDevices: {
      set(devices) {
        this.$store.commit("storeMidiDevices", devices);
      },
      get() {
        return this.$store.state.midiDevices;
      },
    },
    midiDevice: {
      set(device) {
        this.$store.commit("storeMidiDevice", device);
      },
      get() {
        return this.$store.state.midiDevice;
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
    chatMessages() {
      return this.$store.state.chatMessages;
    },

    leftDrawer: {
      set(drawer) {
        this.$store.commit("storeLeftDrawer", drawer);
      },
      get() {
        return this.$store.state.leftDrawer;
      },
    },
    rightDrawer: {
      set(drawer) {
        this.$store.commit("storeRightDrawer", drawer);
      },
      get() {
        return this.$store.state.rightDrawer;
      },
    },
  },
  methods: {},
};
