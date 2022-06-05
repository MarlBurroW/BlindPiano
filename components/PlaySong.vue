<template>
  <div class="d-flex justify-center flex-column align-center fill-height">
    <div
      v-if="game.turnPlayer"
      class="d-flex flex-column justify-center align-center mb-10"
    >
      <Avataaars
        :avatar-options="game.turnPlayer.avatar"
        :height="250"
        :width="250"
        class="mb-5"
      ></Avataaars>

      <div class="message">
        <span :style="{ color: game.turnPlayer.color }">{{
          game.turnPlayer.nickname
        }}</span>
        is playing! Guess the song by typing its name and/or the artist name in
        the chat.
      </div>

      <div class="countdown">
        {{ $formatSeconds(game.countDown) }}
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

            <div class="score">{{ player.score }} point(s)</div>
          </v-card-text>

          <v-divider></v-divider>
          <v-card-actions class="justify-center">
            <v-chip
              class="mx-2"
              :color="player.hasGuessedArtist ? 'success' : ''"
            >
              Artist

              <v-icon right>
                {{ player.hasGuessedArtist ? "mdi-check" : "mdi-close" }}
              </v-icon>
            </v-chip>

            <v-chip
              class="mx-2"
              :color="player.hasGuessedSong ? 'success' : ''"
            >
              Song

              <v-icon right>
                {{ player.hasGuessedSong ? "mdi-check" : "mdi-close" }}
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
      return this.game.players.filter((p) => p.id !== this.game.turnPlayer.id);
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