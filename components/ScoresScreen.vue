<template>
  <div class="fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title class="mb-5 justify-center">
        <h1>Current Score</h1>
      </v-card-title>
      <v-card-text class="mb-5">
        <Scores :players="scoreOrderedPlayers"></Scores>
      </v-card-text>

      <v-card-text
        v-if="currentTurnPlayer.id == me.id"
        class="d-flex justify-center"
      >
        <v-btn x-large @click="startTurn" color="primary">Start my turn</v-btn>
      </v-card-text>

      <v-card-text v-else class="d-flex justify-center">
        <div class="next-player-info">
          The next turn is for
          <span :style="{ color: currentTurnPlayer.color }">{{
            currentTurnPlayer.nickname
          }}</span>
        </div>
      </v-card-text>
    </v-card>
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
    startTurn() {
      this.socket.emit(events.START_TURN);
    },
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.next-player-info {
  font-size: 30px;
}
</style>