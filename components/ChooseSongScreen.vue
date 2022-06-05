<template>
  <div class="fill-height">
    <div v-if="turnInfo && game.isTurnOf(me)">
      <v-card fill-height class="fill-height pa-10">
        <v-card-title class="mb-5 justify-center">
          <h1>Choose your song ({{ $formatSeconds(game.countDown) }})</h1>
        </v-card-title>
        <v-card-text class="mb-5">
          <v-row>
            <v-col v-for="song in turnInfo.proposedSongs" :key="song.id">
              <song-card :song="song">
                <v-card-text class="d-flex justify-center">
                  <v-btn @click="game.chooseSong(song)" x-large color="primary"
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
        :avatar-options="game.turnPlayer.avatar"
        :height="250"
        :width="250"
        class="mb-5"
      ></Avataaars>

      <div class="turn-info text-sm-center">
        <span :style="{ color: game.turnPlayer.color }">{{
          game.turnPlayer.nickname
        }}</span>
        is choosing a song...
      </div>

      <div class="countdown">
        {{ $formatSeconds(game.countDown) }}
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

  computed: {},
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