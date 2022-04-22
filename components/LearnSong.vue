<template>
  <div>
    <div v-if="turnInfo" class="fill-height">
      <song-card :song="turnInfo.song">
        <v-card-text class="d-flex justify-center">
          <v-btn
            :disabled="timeElapsed < 5 || game.state.countDown <= 5"
            v-if="isMyTurn"
            @click="stopLearning"
            x-large
            color="primary"
            >Ready ({{ $formatSeconds(game.state.countDown) }})</v-btn
          >
        </v-card-text>
      </song-card>
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
        <div v-if="isMyTurn">
          <span>Listen and learn to play this song</span>
        </div>
        <div v-else>
          <span :style="{ color: player.color }">{{ player.nickname }}</span>
          is preparing the show !
        </div>
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

  methods: {
    stopLearning() {
      this.socket.emit(events.STOP_LEARNING);
    },
  },

  computed: {
    timeElapsed() {
      return this.game.options.learnTime - this.game.state.countDown;
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