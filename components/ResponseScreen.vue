<template>
  <div class="fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title class="mb-5 justify-center">
        <h1>The song was</h1>
      </v-card-title>
      <v-card-text class="mb-5">
        <song-card autoplay :song="game.state.turn.song"></song-card>
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
.next-player-info {
  font-size: 30px;
}
</style>