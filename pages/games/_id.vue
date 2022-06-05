<template>
  <div class="fill-height">
    <AppBar></AppBar>
    <left-sidebar></left-sidebar>
    <right-sidebar></right-sidebar>

    <v-main app v-if="game">
      <Instrument
        v-for="player in game.players"
        :key="player.key"
        :volume="getLocalPlayerSetting(player.id, 'volume')"
        :instrument="player.instrument"
        :preset="player.preset"
        :player="player"
        :event-bus="keyboardEventBus"
        :master-volume="masterVolumeNode"
      ></Instrument>

      <GameProgress></GameProgress>
      <vue-scroll :ops="scrollOptions">
        <div class="d-flex flex-column fill-height">
          <div class="flex-grow-1" v-if="game">
            <fade-transition mode="out-in">
              <WaitPlayers
                v-if="game.hasState(gameStates.WAITING_PLAYERS_SCREEN)"
              ></WaitPlayers>

              <PreTurn
                v-else-if="game.hasState(gameStates.PRE_TURN_SCREEN)"
              ></PreTurn>

              <ChooseSongScreen
                v-else-if="game.hasState(gameStates.CHOOSE_SONG_SCREEN)"
              ></ChooseSongScreen>
              <LearnSong
                v-else-if="game.hasState(gameStates.LEARNING_SONG_SCREEN)"
              ></LearnSong>

              <PlaySong
                v-else-if="game.hasState(gameStates.PLAY_SONG_SCREEN)"
              ></PlaySong>

              <ScoresScreen
                v-else-if="game.hasState(gameStates.SCORES_SCREEN)"
              ></ScoresScreen>
              <FinalScreen
                v-else-if="game.hasState(gameStates.FINAL_SCREEN)"
              ></FinalScreen>

              <ResponseScreen
                v-else-if="game.hasState(gameStates.RESPONSE_SCREEN)"
              ></ResponseScreen>
            </fade-transition>
          </div>
        </div>
      </vue-scroll>
    </v-main>

    <JoinGameDialog
      @user-created="joinGameSocket(gameId, $event)"
      :open="joinDialog"
    ></JoinGameDialog>

    <v-footer
      color="grey darken-4"
      app
      padless
      v-if="game && socket"
      class="d-flex justify-center footer"
    >
      <Keyboard :volume.sync="volume" :event-bus="keyboardEventBus"></Keyboard>
    </v-footer>
  </div>
</template>

<script>
import contextMixin from "../../mixins/context-mixin";
import { io } from "socket.io-client";
import events from "../../events";
import EventEmitter from "events";
import * as Tone from "tone";

export default {
  layout: "default",
  mixins: [contextMixin],
  props: {},

  mounted() {
    this.$connectSFX(this.masterVolumeNode);

    this.gameId = this.$route.params.id;

    const socket = io();
    this.$setSocketInstance(socket);

    socket.onAny((eventName) => {
      console.log(eventName);
    });

    this.socket.on(events.DISCONNECT, (game) => {
      this.$notyf.error("Socket disconnected");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.CONNECT, (game) => {
      console.log("Socket connected");
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
      this.$store.commit("addChatMessage", message);
    });

    this.socket.on(events.PLAYER_JOINED, (message) => {
      this.$playSFX("new-player");
    });

    this.socket.on(events.PLAYER_DISCONNECTED, (message) => {
      this.$playSFX("player-disconnect");
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

    this.socket.on(events.KEY_PRESSED, (payload) => {
      this.keyboardEventBus.emit("key-pressed", payload);
    });

    this.socket.on(events.KEY_RELEASED, (payload) => {
      this.keyboardEventBus.emit("key-released", payload);
    });

    this.socket.on(events.HOLD_PEDAL, (payload) => {
      this.keyboardEventBus.emit("hold-pedal", payload);
    });

    this.keyboardEventBus.on("key-pressed", (payload) => {
      if (payload.from == this.me.id) {
        this.socket.emit(events.KEY_PRESSED, payload);
      }
    });

    this.keyboardEventBus.on("key-released", (payload) => {
      if (payload.from == this.me.id) {
        this.socket.emit(events.KEY_RELEASED, payload);
      }
    });
  },

  watch: {
    masterVolume(val) {
      this.masterVolumeNode.volume.value = val;
    },

    "game.state.type": {
      handler() {
        this.keyboardEventBus.emit("reset");
      },
    },

    midiDevice(midiDevice) {
      this.socket.emit(
        events.UPDATE_DEVICE_NAME,
        midiDevice ? midiDevice.name : null
      );
    },

    instrument(instrument) {
      this.socket.emit(events.SET_INSTRUMENT, instrument);
    },
    preset(preset) {
      this.socket.emit(events.SET_PRESET, preset);
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
      masterVolumeNode: new Tone.Volume(0).toDestination(),
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