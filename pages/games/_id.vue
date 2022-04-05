<template>
  <div>
    <v-app-bar app clipped-left clipped-right>
      <v-toolbar-title>Blind PIano</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <left-sidebar></left-sidebar>

    <v-main>
      <v-container v-if="game" class="py-8 px-6" fluid> </v-container>
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
    });

    this.socket.on(events.GAME_ALREADY_STARTED, () => {
      this.$notyf.error("Game has already been started.");
      this.$router.push({ name: "index" });
    });

    this.socket.on(events.CHAT_MESSAGE, (message) => {
      this.$store.commit("addChatMessage", message);
    });
  },

  watch: {
    gameState(state, oldState) {
      if (state == "running") {
        window.localStorage.setItem(this.game.id, this.claimToken);
      }
    },
  },

  methods: {
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
      joinDialog: false,
    };
  },
};
</script>

<style>
</style>