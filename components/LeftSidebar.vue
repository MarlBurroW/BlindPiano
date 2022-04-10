<template>
  <v-navigation-drawer :value="leftDrawer" width="350" app clipped>
    <player-list v-if="game" :players="game.players"></player-list>
  </v-navigation-drawer>
</template>

<script>
import contextMixin from "../mixins/context-mixin";

export default {
  mixins: [contextMixin],
};
</script>

<style>
</style>