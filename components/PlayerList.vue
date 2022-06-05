<template>
  <div class="pa-5">
    <v-card
      :style="{ borderColor: player.color, opacity: player.online ? 1 : 0.3 }"
      v-for="player in players"
      :key="player.id"
      class="mb-5 player-card"
    >
      <div class="d-flex flex-no-wrap">
        <div class="d-flex flex-column justify-center px-3">
          <v-badge dot :color="player.online ? 'success' : 'error'" overlap>
            <Avataaars
              :avatar-options="player.avatar"
              :height="50"
              :width="50"
            ></Avataaars>
          </v-badge>
        </div>
        <div class="flex-grow-1">
          <v-card-text>
            <p class="text-h5 text--primary mb-0">
              <v-icon size="20" color="warning" v-if="player.leader"
                >mdi-star</v-icon
              >{{ player.nickname }}
            </p>

            <div class="mt-3" v-if="!player.spectator">
              <strong
                style="font-size: 25px"
                :style="{ color: player.color }"
                >{{ player.score }}</strong
              >
              points
            </div>
          </v-card-text>
        </div>

        <div class="d-flex flex-column justify-center align-end">
          <v-menu left bottom v-if="game.isLeader(me) && player.id !== me.id">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-if="game.isLeader(me) && player.id !== me.id"
                @click="game.kick(player)"
              >
                <v-list-item-title>Kick </v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="game.isLeader(me) && player.id !== me.id"
                @click="game.promote(player)"
              >
                <v-list-item-title>Promote</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import events from "../events";

export default {
  mixins: [],
  props: {
    players: {
      type: Array,
    },
    me: {
      type: Object,
    },
    game: {
      type: Object,
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.player-card {
  border-left: 10px solid;
}
</style> 