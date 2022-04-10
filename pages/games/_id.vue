<template>
  <div class="fill-height">
    <AppBar></AppBar>
    <left-sidebar></left-sidebar>

    <v-main app class="fill-height">
      <div class="d-flex flex-column fill-height">
        <div class="flex-grow-1"></div>
        <v-container class="px-0 py-0" v-if="game" fluid>
          <Instrument
            :volume="volume"
            :event-bus="keyboardEventBus"
          ></Instrument>

          <Keyboard
            :volume.sync="volume"
            :event-bus="keyboardEventBus"
          ></Keyboard>
        </v-container>
      </div>
    </v-main>
    <right-sidebar></right-sidebar>
    <WaitPlayers></WaitPlayers>

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

    if (!this.claimToken) {
      this.claimToken = window.localStorage.getItem(this.gameId);
    }

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

    this.socket.on(events.CHAT_MESSAGE, (message) => {
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
  },

  watch: {
    midiDevice(midiDevice) {
      this.socket.emit(
        events.UPDATE_DEVICE_NAME,
        midiDevice ? midiDevice.name : null
      );
    },
    gameState(state, oldState) {
      if (state == "running") {
        window.localStorage.setItem(this.game.id, this.claimToken);
      }
    },
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
    };
  },
};
</script>

<style>
</style>