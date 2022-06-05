<template>
  <v-navigation-drawer v-model="leftDrawer" width="350" app clipped>
    <div v-if="game && game.players.length > 0">
      <v-subheader>PLAYERS</v-subheader>
      <player-list
        v-if="game && game.players.length > 0"
        :me="me"
        :game="game"
        :players="game.players"
      ></player-list>
    </div>
    <div v-if="game && game.spectators.length > 0">
      <v-subheader>SPECTATORS</v-subheader>

      <player-list
        :me="me"
        :game="game"
        :players="game.spectators"
      ></player-list>
    </div>
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