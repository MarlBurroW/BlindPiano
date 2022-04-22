<template>
  <div class="d-flex justify-center flex-column align-center fill-height">
    <div
      v-if="player"
      class="d-flex flex-column justify-center align-center mb-10"
    >
      <Avataaars
        :avatar-options="player.avatar"
        :height="250"
        :width="250"
        class="mb-5"
      ></Avataaars>

      <div class="message">
        <span :style="{ color: player.color }">{{ player.nickname }}</span> is
        playing! Guess the song by typing its name and/or the artist name in the
        chat.
      </div>

      <div class="countdown">
        {{ $formatSeconds(this.game.state.countDown) }}
      </div>
    </div>

    <v-row style="width: 100%" class="justify-center">
      <v-col md="6" sm="12" lg="3" :key="player.id" v-for="player in guessers">
        <v-card :style="{ borderTop: `solid 10px ${player.color} !important` }">
          <v-card-text class="d-flex justify-center">
            <Avataaars
              :avatar-options="player.avatar"
              :height="80"
              :width="80"
            ></Avataaars>
          </v-card-text>
          <v-card-text style="text-align: center">
            <span class="nickname" :style="{ color: player.color }">{{
              player.nickname
            }}</span>

            <div class="score">{{ getPlayerScore(player.id) }} point(s)</div>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-chip
              class="mx-2"
              :color="getPlayerArtistGuessState(player.id) ? 'success' : ''"
            >
              Artist

              <v-icon right>
                {{
                  getPlayerArtistGuessState(player.id)
                    ? "mdi-check"
                    : "mdi-close"
                }}
              </v-icon>
            </v-chip>

            <v-chip
              class="mx-2"
              :color="getPlayerSongGuessState(player.id) ? 'success' : ''"
            >
              Song

              <v-icon right>
                {{
                  getPlayerSongGuessState(player.id) ? "mdi-check" : "mdi-close"
                }}
              </v-icon>
            </v-chip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";
export default {
  mixins: [contextMixin],
  props: {},

  methods: {},

  computed: {
    guessers() {
      return this.game.players.filter((p) => p.id !== this.player.id);
    },

    player() {
      return this.game.players.find(
        (p) => p.id === this.game.state.turn.playerId
      );
    },
    turn() {
      return this.game.state.turn;
    },
  },
};
</script>

<style lang="scss" scoped>
.nickname {
  font-size: 25px;
}

.message {
  font-size: 20px;
  text-align: center;
}

.countdown {
  font-size: 50px;
}

.score {
  font-size: 20px;
}
</style>