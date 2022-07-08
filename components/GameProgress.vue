<template>
  <div>
    <v-toolbar
      flat
      v-if="game && game.progress"
      class="d-flex justify-center transparent-background-3"
    >
      <div :key="round.number" v-for="(round, i) in game.progress">
        <v-chip
          class="ma-2"
          label
          outlined
          :color="round.current ? 'primary' : 'grey'"
          text-color="white"
        >
          <v-avatar left v-if="round.finished">
            <v-icon>mdi-check</v-icon>
          </v-avatar>
          {{ round.name }}
        </v-chip>
        <v-icon v-if="i + 1 < game.progress.length">mdi-chevron-right</v-icon>
      </div>
    </v-toolbar>
    <v-toolbar
      dense
      flat
      v-if="currentRoundTurns"
      class="d-flex justify-center transparent-background-3 flat"
    >
      <div :key="turn.playerId" v-for="(turn, i) in currentRoundTurns">
        <v-chip
          class="ma-2"
          label
          outlined
          text-color="white"
          :color="turn.current ? 'primary' : 'grey'"
        >
          <v-avatar left>
            <v-icon :color="turn.color">mdi-account-circle-outline</v-icon>
          </v-avatar>
          {{ turn.nickname }}

          <span v-if="countDown > 0 && turn.current">
            &nbsp;({{ currentGameState }} {{ $formatSeconds(countDown) }})</span
          >
          <v-avatar right v-if="turn.finished">
            <v-icon>mdi-check</v-icon>
          </v-avatar>
        </v-chip>
        <v-icon v-if="i + 1 < currentRoundTurns.length"
          >mdi-chevron-right</v-icon
        >
      </div>
    </v-toolbar>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
  computed: {
    currentRoundTurns() {
      const currentRound =
        this.game && this.game.progress
          ? this.game.progress.find((r) => r.current)
          : null;

      if (currentRound) {
        return currentRound.turns;
      } else {
        return null;
      }
    },
  },
};
</script>

<style>
</style>