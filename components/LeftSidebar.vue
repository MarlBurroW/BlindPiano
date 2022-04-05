<template>
  <v-navigation-drawer width="300" app clipped permanent>
    <v-list v-if="game">
      <v-list-item
        :disabled="!player.online"
        v-for="player in game.players"
        :key="player.id"
      >
        <v-list-item-icon>
          <v-badge
            bordered
            dot
            :color="player.online ? 'success' : 'error'"
            overlap
          >
            <Avataaars
              :avatar-options="player.avatar"
              :height="30"
              :width="30"
            ></Avataaars>
          </v-badge>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="overline">{{
            player.nickname
          }}</v-list-item-title>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon color="warning" v-if="game.leaderId === player.id"
            >mdi-star</v-icon
          >
        </v-list-item-icon>

        <v-list-item-action>
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
                <v-list-item-title
                  >Kick {{ player.nickname }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </v-list>
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