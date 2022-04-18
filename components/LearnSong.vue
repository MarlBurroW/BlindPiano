<template>
  <div>
    <div class="d-flex justify-center flex-column align-center fill-height">
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
        {{ this.game.state.countDown }}
      </div>
    </div>

    <div v-if="turnInfo" class="fill-height">
      <iframe
        :src="`https://open.spotify.com/embed/track/${turnInfo.song.id}?utm_source=generator`"
        width="100%"
        height="400px"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </div>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import events from "../events";

export default {
  mixins: [contextMixin],

  beforeUnmount() {
    this.socket.off(
      events.UPDATE_LEARNING_COUNTDOWN,
      this.updateLearningCountdown
    );
  },

  created() {
    this.socket.on(
      events.UPDATE_LEARNING_COUNTDOWN,
      this.updateLearningCountdown
    );
  },

  methods: {
    updateLearningCountdown(countDown) {
      this.game.state.countDown = countDown;
    },
  },

  computed: {
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