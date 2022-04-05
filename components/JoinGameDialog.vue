<template>
  <v-dialog max-width="600" persistent :value="open">
    <v-form id="create-game-form" @submit.prevent="joinGame">
      <v-card class="elevation-12">
        <v-toolbar dark>
          <v-toolbar-title>Enter your nickname</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            outlined
            v-model="nickname"
            :disabled="joinGameLoading"
            :error-messages="
              errors && errors.nickname
                ? `${errors.nickname.param} ${errors.nickname.msg}`
                : null
            "
            prepend-inner-icon="mdi-account"
            name="nickname"
            label="Nickname"
            type="text"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-spacer></v-spacer>

          <v-btn
            :loading="joinGameLoading"
            :disabled="joinGameLoading"
            type="submit"
            form="create-game-form"
            color="primary"
            >Join the game !</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    joinGame() {
      this.errors = null;
      this.error = null;
      this.joinGameLoading = false;

      this.$axios
        .post("/api/games", { nickname: this.nickname, gameId: this.gameId })
        .then((res) => {
          this.game = res.data.game;
          this.claimToken = res.data.claimToken;

          this.$emit("user-created", this.claimToken);
        })
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
            this.$notyf.error("Validation error");
          } else {
            this.$notyf.error(err);
            this.error = err;
          }
        });
    },
  },
  data() {
    return {
      joinGameLoading: false,
      nickname: "",
      errors: null,
      error: null,
    };
  },
};
</script>

<style>
</style>