<template>
  <div>
    <div v-if="turnInfo" class="fill-height">
      <song-card :song="turnInfo.song">
        <v-card-text class="d-flex justify-center">
          <v-btn
            :disabled="timeElapsed < 5 || game.countDown <= 5"
            v-if="game.isTurnOf(me)"
            @click="game.stopLearning()"
            x-large
            color="primary"
            >Ready ({{ $formatSeconds(game.countDown) }})</v-btn
          >
        </v-card-text>
      </song-card>
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
        <div v-if="game.isTurnOf(me)">
          <span>Listen and learn to play this song</span>
        </div>
        <div v-else>
          <span :style="{ color: game.turnPlayer.color }">{{
            game.turnPlayer.nickname
          }}</span>
          is preparing the show !
        </div>
      </div>

      <div class="countdown">
        {{ $formatSeconds(game.countDown) }}
      </div>
    </div>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],

  computed: {
    timeElapsed() {
      return this.game.options.learnTime - this.game.countDown;
    },
  },
  data() {
    return {};
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