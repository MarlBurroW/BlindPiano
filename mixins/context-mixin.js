import gameStates from "../game_states";

export default {
  computed: {
    gameStates() {
      return gameStates;
    },

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
    masterVolume: {
      set(masterVolume) {
        this.$store.commit("storeMasterVolume", masterVolume);
      },
      get() {
        return this.$store.state.masterVolume;
      },
    },
    turnInfo: {
      set(turnInfo) {
        this.$store.commit("storePrivateTurnInfo", turnInfo);
      },
      get() {
        return this.$store.state.privateTurnInfo;
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
    instrument: {
      set(instrument) {
        this.$store.commit("storeInstrument", instrument);
      },
      get() {
        return this.$store.state.instrument;
      },
    },
    preset: {
      set(preset) {
        this.$store.commit("storePreset", preset);
      },
      get() {
        return this.$store.state.preset;
      },
    },
    spectators() {
      return this.game ? this.game.spectators : [];
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

    currentRound() {
      return this.game && this.game.state && this.game.state.round
        ? this.game.state.round
        : null;
    },

    currentTurnPlayer() {
      return this.game.players.find(
        (p) => p.id === this.game.state.turn.playerId
      );
    },

    currentTurn() {
      return this.game && this.game.state && this.game.state.turn
        ? this.game.state.turn
        : null;
    },

    isMyTurn() {
      return (
        this.game &&
        this.game.state &&
        this.game.state.turn &&
        this.game.state.turn.playerId == this.me.id
      );
    },
    countDown() {
      return this.game && this.game.state && this.game.state.countDown
        ? this.game.state.countDown
        : null;
    },

    localPlayersSettings() {
      return this.$store.state.localPlayersSettings;
    },

    currentGameState() {
      const mapping = {
        WAITING_PLAYERS_SCREEN: "Waiting players",
        PRE_TURN_SCREEN: "",
        FINISHED: "Game finished",
        LEARNING_SONG_SCREEN: "Learning",
        CHOOSE_SONG_SCREEN: "Song choice",
        PLAY_SONG_SCREEN: "Playing song",
        SCORES_SCREEN: "Scores",
        FINAL_SCREEN: "Game finished",
        RESPONSE_SCREEN: "Response",
      };

      if (this.game && this.game.state) {
        return mapping[this.game.state.type];
      } else {
        return null;
      }
    },
    showKeyboard: {
      set(showKeyboard) {
        this.$store.commit("storeShowKeyboard", showKeyboard);
      },
      get() {
        return this.$store.state.showKeyboard;
      },
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

    spectators() {
      return this.game.spectators.map((p) => {
        p.leader = this.game.leaderId == p.id;

        return p;
      });
    },

    scoreOrderedPlayers() {
      if (this.players) {
        return this.players.sort((a, b) => {
          return b.score - a.score;
        });
      } else {
        return [];
      }
    },
  },
  methods: {
    getLocalPlayerSetting(playerId, prop) {
      return this.$store.state.localPlayersSettings[playerId][prop];
    },
    setLocalPlayerSetting(playerId, prop, value) {
      this.$store.commit("storeLocalPlayerSetting", {
        playerId,
        prop,
        value,
      });
    },

    getPlayerArtistGuessState(playerId) {
      return this.turn.artistWins[playerId];
    },
    getPlayerSongGuessState(playerId) {
      return this.turn.songWins[playerId];
    },
    getPlayerScore(playerId) {
      return this.game.scores[playerId] || 0;
    },

    getPlayerById(playerId) {
      return this.game.players[playerId] || null;
    },
  },
};
