<template>
  <div class="fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title class="mb-5 justify-center">
        <h1>Current Score</h1>
      </v-card-title>
      <v-card-text class="mb-5">
        <Scores :players="game.scoreOrderedPlayers"></Scores>
      </v-card-text>

      <v-card-text v-if="game.isTurnOf(me)" class="d-flex justify-center">
        <v-btn x-large @click="game.startTurn()" color="primary"
          >Start my turn</v-btn
        >
      </v-card-text>

      <v-card-text v-else class="d-flex justify-center">
        <div class="next-player-info">
          The next turn is for
          <span :style="{ color: game.turnPlayer.color }">{{
            game.turnPlayer.nickname
          }}</span>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
  computed: {},
};
</script>

<style lang="scss" scoped>
.next-player-info {
  font-size: 30px;
}
</style>