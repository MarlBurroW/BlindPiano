<template>
  <div class="fill-height">
    <AppBar></AppBar>
    <left-sidebar></left-sidebar>

    <v-main app class="fill-height">
      <v-toolbar dense v-if="game && game.state && game.state.turn">
        <v-toolbar-title v-if="currentRound">
          Round {{ currentRound.number }}/{{ game.roundCount }}
        </v-toolbar-title>

        <v-toolbar-title v-if="currentTurnPlayer">
          &nbsp;|&nbsp;
          <span :style="{ color: currentTurnPlayer.color }">{{
            currentTurnPlayer.nickname
          }}</span
          >'s turn
        </v-toolbar-title>

        <v-toolbar-title v-if="countDown">
          &nbsp;|&nbsp;<strong>{{ $formatSeconds(countDown) }}</strong>
        </v-toolbar-title>
      </v-toolbar>
      <vue-scroll :ops="scrollOptions">
        <div class="d-flex flex-column fill-height">
          <div class="flex-grow-1" v-if="game">
            <zoom-center-transition mode="out-in">
              <WaitPlayers
                v-if="gameState.type == gameStates.WAITING_PLAYERS_SCREEN"
              ></WaitPlayers>

              <PreTurn
                v-else-if="gameState.type == gameStates.PRE_TURN_SCREEN"
              ></PreTurn>

              <ChooseSongScreen
                v-else-if="gameState.type == gameStates.CHOOSE_SONG_SCREEN"
              ></ChooseSongScreen>
              <LearnSong
                v-else-if="gameState.type == gameStates.LEARNING_SONG_SCREEN"
              ></LearnSong>

              <PlaySong
                v-else-if="gameState.type == gameStates.PLAY_SONG_SCREEN"
              ></PlaySong>

              <ScoresScreen
                v-else-if="gameState.type == gameStates.SCORES_SCREEN"
              ></ScoresScreen>
              <FinalScreen
                v-else-if="gameState.type == gameStates.FINAL_SCREEN"
              ></FinalScreen>

              <ResponseScreen
                v-else-if="gameState.type == gameStates.RESPONSE_SCREEN"
              ></ResponseScreen>
            </zoom-center-transition>
          </div>
        </div>
      </vue-scroll>
    </v-main>
    <right-sidebar></right-sidebar>
    <v-footer app padless v-if="game && socket">
      <Instrument :volume="volume" :event-bus="keyboardEventBus"></Instrument>

      <Keyboard :volume.sync="volume" :event-bus="keyboardEventBus"></Keyboard>
    </v-footer>
    <JoinGameDialog
      @user-created="joinGameSocket(gameId, $event)"
      :open="joinDialog"
    ></JoinGameDialog>
  </div>
</template>

<script>
import contextMixin from "../../mixins/context-mixin";
import { io } from "socket.io-client";
import events from "../../events";
import EventEmitter from "events";

export default {
  layout: "default",
  mixins: [contextMixin],
  props: {},

  mounted() {
    this.gameId = this.$route.params.id;

    const socket = io();
    this.$setSocketInstance(socket);

    this.socket.on(events.DISCONNECT, (game) => {
      this.$notyf.error("Socket disconnected");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.CONNECT, (game) => {
      this.joinGameSocket(this.gameId, this.claimToken);
    });

    this.socket.on(events.CONNECT_ERROR, (err) => {
      this.$notyf.error(err.message);
    });

    this.socket.on(events.GAME_UPDATED, (game) => {
      this.game = game;
    });

    this.socket.on(events.MESSAGE, (payload) => {
      this.$notyf.open(payload);
    });

    this.socket.on(events.ASK_NICKNAME, () => {
      this.joinDialog = true;
    });

    this.socket.on(events.GAME_JOINED, ({ me, game }) => {
      this.me = me;
      this.game = game;
      this.joinDialog = false;
      this.$playSFX("new-player");
      this.startDevice();
    });

    this.socket.on(events.GAME_ALREADY_STARTED, () => {
      this.$notyf.error("Game has already been started.");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.GAME_FINISHED, () => {
      this.$notyf.error("Game finished.");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.GAME_NOT_FOUND, () => {
      this.$notyf.error("Game not found.");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.CHAT_MESSAGE, (message) => {
      this.$store.commit("addChatMessage", message);
    });

    this.socket.on(events.LOG, (message) => {
      console.log(message);
      this.$store.commit("addChatMessage", message);
    });

    this.socket.on(events.PLAYER_JOINED, (message) => {
      this.$playSFX("new-player");
    });

    this.socket.on(events.PLAYER_DISCONNECTED, (message) => {
      this.$playSFX("player-disconnect");
    });

    this.keyboardEventBus.on("key-pressed", (key) => {
      this.socket.emit(events.KEY_PRESSED, key);
    });

    this.keyboardEventBus.on("key-released", (key) => {
      this.socket.emit(events.KEY_RELEASED, key);
    });

    this.socket.on(events.UPDATE_TIMER, (timer) => {
      this.turnTimer = timer;
    });

    this.socket.on(events.PLAY_SFX, (sfxName) => {
      this.$playSFX(sfxName);
    });

    this.socket.on(events.PRIVATE_TURN_INFO, (turnInfo) => {
      this.turnInfo = turnInfo;
    });

    this.socket.on(events.UPDATE_COUNTDOWN, (countDown) => {
      if (this.game && this.game.state && this.game.state.countDown) {
        this.game.state.countDown = countDown;
      }
    });
  },

  watch: {
    midiDevice(midiDevice) {
      this.socket.emit(
        events.UPDATE_DEVICE_NAME,
        midiDevice ? midiDevice.name : null
      );
    },
    gameState(state, oldState) {},
  },

  methods: {
    startDevice() {
      this.midiDevices = this.$webMidi.inputs;

      this.autoSelectDevice();

      this.$webMidi.addListener("portschanged", () => {
        this.midiDevices = this.$webMidi.inputs;

        this.autoSelectDevice();
      });
    },

    autoSelectDevice() {
      if (!this.$store.state.midiDevice && this.$webMidi.inputs.length > 0) {
        this.midiDevice = this.$webMidi.inputs[0];
      }
    },

    kick(player) {
      this.socket.emit(events.KICK_PLAYER, player.id);
    },

    joinGameSocket(gameId, claimToken) {
      this.socket.emit(events.JOIN_GAME, {
        gameId: gameId,
        claimToken: claimToken,
      });
    },
  },
  computed: {
    config() {
      return this.$config;
    },
  },
  data() {
    return {
      keyboardEventBus: new EventEmitter(),
      volume: 0,
      joinDialog: false,
      turnTimer: 0,

      scrollOptions: {
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: true,
          keepShow: false,
          background: "#121212",
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: 0,
          size: "6px",
          disable: false,
        },
        vuescroll: {
          mode: "native",
          sizeStrategy: "percent",
          detectResize: true,
          zooming: false,

          scroller: {
            bouncing: {
              left: 0,
              right: 0,
            },
          },
        },
        scrollPanel: {
          scrollingX: false,
          scrollingY: true,
        },
      },
    };
  },
};
</script>

<style scoped lang="scss">
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>