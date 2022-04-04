<template>
  <div>
    <WaitPlayers></WaitPlayers>

    <JoinGameDialog
      @user-created="joinGameSocket(gameId, $event)"
      :game-id="gameId"
      :open="joinDialog"
    ></JoinGameDialog>
  </div>
</template>

<script>
import contextMixin from "../../mixins/context-mixin";
import { io } from "socket.io-client";

export default {
  layout: "default",
  mixins: [contextMixin],
  props: {},

  mounted() {
    this.gameId = this.$route.params.id;

    const socket = io();
    this.$setSocketInstance(socket);

    this.socket.on("disconnect", (game) => {
      this.$notyf.error("Socket disconnected");
      this.$router.push({ name: "index" });
    });

    this.socket.on("connect", (game) => {
      this.joinGameSocket(this.gameId, this.claimToken);
    });

    this.socket.on("connect_error", (err) => {
      this.$notyf.error(err.message);
    });

    this.socket.on("game:update", (game) => {
      this.game = game;
    });

    this.socket.on("message", (payload) => {
      this.$notyf.open(payload);
    });
  },
  methods: {
    joinGameSocket(gameId, claimToken) {
      this.socket.emit(
        "join-game",
        {
          gameId: gameId,
          claimToken: claimToken,
        },
        (response) => {
          if (response.type == "error") {
            this.$notyf.error(response.message);
            this.$router.push({ name: "index" });
          } else {
            if (response.type == "success") {
              if (response.code == "game:need-player-info") {
                this.joinDialog = true;
              } else {
                this.me = response.me;
                this.game = response.game;
                this.joinDialog = false;
              }
            }
          }
        }
      );
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