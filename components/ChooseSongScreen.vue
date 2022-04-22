<template>
  <div class="fill-height">
    <div v-if="turnInfo && isMyTurn">
      <v-card fill-height class="fill-height pa-10">
        <v-card-title class="mb-5 justify-center">
          <h1>Choose your song ({{ $formatSeconds(game.state.countDown) }})</h1>
        </v-card-title>
        <v-card-text class="mb-5">
          <v-row>
            <v-col v-for="song in turnInfo.proposedSongs" :key="song.id">
              <song-card :song="song">
                <v-card-text class="d-flex justify-center">
                  <v-btn @click="choose(song)" x-large color="primary"
                    >Select</v-btn
                  >
                </v-card-text>
              </song-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
    <div
      v-else
      class="d-flex justify-center flex-column align-center fill-height mb-5"
    >
      <Avataaars
        :avatar-options="player.avatar"
        :height="250"
        :width="250"
        class="mb-5"
      ></Avataaars>

      <div class="turn-info text-sm-center">
        <span :style="{ color: player.color }">{{ player.nickname }}</span>
        is choosing a song...
      </div>

      <div class="countdown">
        {{ $formatSeconds(this.game.state.countDown) }}
      </div>
    </div>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";
export default {
  mixins: [contextMixin],
  props: {},
  beforeUnmount() {},
  mounted() {},
  methods: {
    choose(song) {
      this.socket.emit(events.CHOOSE_SONG, song.id);
    },
  },
  computed: {
    player() {
      return this.game.players.find(
        (p) => p.id === this.game.state.turn.playerId
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.turn-info {
  font-size: 40px;
}

.countdown {
  font-size: 50px;
}
</style>