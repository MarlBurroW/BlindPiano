<template>
  <div class="d-flex justify-center flex-column align-center fill-height">
    <div v-if="player" class="d-flex justify-center">
      <Avataaars
        :avatar-options="player.avatar"
        :height="250"
        :width="250"
        class="mb-5"
      ></Avataaars>
    </div>
    <div class="nickname d-flex text-sm-center">
      <div>
        <span :style="{ color: player.color }">{{ player.nickname }}</span
        >'s
        <br />
        turn in {{ gameState.countDown }} seconds
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

  methods: {},

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
};
</script>

<style lang="scss" scoped>
.nickname {
  font-size: 40px;
}
</style>