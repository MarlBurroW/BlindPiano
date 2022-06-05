<template>
  <v-card
    color="grey darken-3"
    class="player-card"
    :style="{ borderTop: `solid 10px ${player.color} !important` }"
  >
    <v-app-bar flat color="rgba(0, 0, 0, 0)">
      <v-spacer></v-spacer>
      <v-toolbar-title class="text-h6 white--text pl-0">
        {{ player.nickname }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu left bottom v-if="me.id !== player.id && me.id == game.leaderId">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="kick(player)">
            <v-list-item-title>Kick </v-list-item-title>
          </v-list-item>
          <v-list-item @click="promote(player)">
            <v-list-item-title>Promote </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-card-text>
      <v-layout align-center justify-center>
        <v-badge :value="leader" color="transparent" overlap>
          <template v-slot:badge>
            <v-icon color="warning" size="40">mdi-star</v-icon>
          </template>
          <Avataaars
            :avatar-options="player.avatar"
            :height="150"
            :width="150"
            class="mb-5"
          ></Avataaars>
        </v-badge>
      </v-layout>
      <v-layout align-center justify-center>
        <v-btn
          v-if="me.id == player.id"
          x-large
          class="primary"
          @click="spectator(player.spectator)"
          >{{ player.spectator ? "Become a player" : "Become a spectator" }}
        </v-btn>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    player: {
      type: Object,
      required: true,
    },
    leader: {
      type: Boolean,
    },
    me: {
      type: Object,
      required: true,
    },
    game: {
      type: Object,
      required: true,
    },
  },
  methods: {
    kick(player) {
      this.$emit("kick", player);
    },
    promote(player) {
      this.$emit("promote", player);
    },
    spectator(player) {
      this.$emit("spectator", !player.spectator);
    },
  },
};
</script>

<style scoped lang="scss">
.nickname {
  font-size: 25px;
}

.player-card {
}
</style>