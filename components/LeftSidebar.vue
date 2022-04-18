<template>
  <v-navigation-drawer v-model="leftDrawer" width="350" app clipped>
    <player-list v-if="game" :players="scoreOrderedPlayers"></player-list>
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