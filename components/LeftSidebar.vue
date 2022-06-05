<template>
  <v-navigation-drawer v-model="leftDrawer" width="350" app clipped>
    <v-subheader>PLAYERS</v-subheader>
    <player-list v-if="game"  :me="me" :game="game" :players="scoreOrderedPlayers"></player-list>
    <v-subheader>SPECTATORS</v-subheader>

 
    <player-list v-if="game" :me="me" :game="game"  :players="spectators"></player-list>
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