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
              <v-icon
                size="20"
                color="warning"
                v-if="game.leaderId === player.id"
                >mdi-star</v-icon
              >{{ player.nickname }}
            </p>

            <div v-if="getPlayerScore(player.id)" class="mt-3">
              <strong
                style="font-size: 25px"
                :style="{ color: player.color }"
                >{{ getPlayerScore(player.id) }}</strong
              >
              points
            </div>
          </v-card-text>
        </div>

        <div class="d-flex flex-column justify-center align-end">
          <v-menu left bottom v-if="isLeader && player.id !== me.id">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-if="isLeader && player.id !== me.id"
                @click="kick(player)"
              >
                <v-list-item-title>Kick </v-list-item-title>
              </v-list-item>

              <v-list-item
                v-if="isLeader && player.id !== me.id"
                @click="promote(player)"
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
import contextMixin from "../mixins/context-mixin";
import events from "../events";

export default {
  mixins: [contextMixin],
  props: {},
  methods: {
    kick(player) {
      this.socket.emit(events.KICK_PLAYER, player.id);
    },
    promote(player) {
      this.socket.emit(events.PROMOTE, player.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.player-card {
  border-left: 10px solid;
}
</style> 