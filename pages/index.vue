<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md6>
            <v-form id="create-game-form" @submit.prevent="createGame">
              <v-card class="elevation-12">
                <v-toolbar dark>
                  <v-toolbar-title>Create a new game</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                  <avatar-creator :avatar.sync="avatar"></avatar-creator>

                  <v-text-field
                    outlined
                    v-model="nickname"
                    :disabled="createGameLoading"
                    :error-messages="
                      errors && errors.nickname
                        ? `${errors.nickname.param} ${errors.nickname.msg}`
                        : null
                    "
                    prepend-inner-icon="mdi-account"
                    name="nickname"
                    label="Enter your nickname"
                    type="text"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    :loading="createGameLoading"
                    :disabled="createGameLoading"
                    type="submit"
                    form="create-game-form"
                    color="primary"
                    >Create game</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
export default {
  mixins: [contextMixin],
  methods: {
    createGame() {
      this.errors = null;
      this.error = null;
      this.createGameLoading = true;
      this.$axios
        .post("/api/games", { nickname: this.nickname, avatar: this.avatar })
        .then((res) => {
          const gameId = res.data.gameId;

          // localStorage.setItem(game.id, claimToken);

          this.claimToken = res.data.claimToken;

          this.$router.push({
            name: "games-id",
            params: { id: gameId },
          });
        })
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            this.errors = err.response.data.errors;
            this.$notyf.error("Validation error");
          } else {
            this.$notyf.error(err);
            this.error = err;
          }
        })
        .finally(() => {
          this.createGameLoading = false;
        });
    },
  },
  data: () => ({
    createGameLoading: false,
    nickname: "",
    avatar: null,
    errors: null,
    error: null,
  }),
};
</script>

<style>
</style>