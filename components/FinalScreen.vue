<template>
  <div class="fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title class="mb-5 justify-center">
        <h1>Game finished !</h1>
      </v-card-title>
      <v-divider class="mb-5"></v-divider>

      <v-card-text>
        <Scores :players="game.scoreOrderedPlayers"></Scores>
      </v-card-text>

      <v-card-text v-if="game.isLeader(me)" class="d-flex justify-center">
        <v-btn x-large @click="game.restartGame()" color="primary"
          >Start a new game</v-btn
        >
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
  methods: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.rank {
  font-size: 35px !important;
  font-weight: bold;
}

.nickname {
  font-size: 30px !important;
}

.score {
  span {
    font-size: 30px;
    font-weight: bold;
  }
}
</style>