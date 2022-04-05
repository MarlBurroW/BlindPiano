<template>
  <v-dialog max-width="600" persistent :value="open">
    <v-card class="elevation-12">
      <v-toolbar dark>
        <v-toolbar-title>Invite your friends</v-toolbar-title>
      </v-toolbar>
      <v-card-text v-if="game">
        <v-list subheader>
          <v-subheader
            >{{ game.players.length }}
            {{ game.players.length > 1 ? "players" : "player" }} in the
            party</v-subheader
          >

          <v-data-table
            hide-default-footer
            hide-default-header
            :headers="[
              {
                text: 'Player',
                align: 'start',
                sortable: false,
                value: 'nickname',
              },
              {
                text: 'Actions',
                align: 'right',
                sortable: false,
                value: 'actions',
              },
            ]"
            :items="game.players"
          >
            <template v-slot:item.nickname="{ item }">
              <v-icon v-if="game.leaderId === item.id" color="warning"
                >mdi-star</v-icon
              ><span class="overline"> {{ item.nickname }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn
                v-if="isLeader && item.id !== me.id"
                icon
                @click="kick(item)"
              >
                <v-icon color="red darken-3"> mdi-close </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-list>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-text-field
          label="Invitation link"
          readonly
          outlined
          rounded
          :value="$gameLink(game)"
          append-icon="mdi-link"
          v-clipboard:copy="$gameLink(game)"
          v-clipboard:success="() => $notyf.success('Link copied')"
        ></v-text-field>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-actions class="justify-end" v-if="isLeader">
        <v-btn
          :disabled="game.players.length < 2"
          v-if="isLeader"
          class="primary"
          @click="startGame"
        >
          Start <v-icon right>mdi-send-outline</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import gameStates from "../game_states";
import events from "../events";

export default {
  mixins: [contextMixin],

  methods: {
    startGame() {
      this.socket.emit(events.START_GAME);
    },
    kick(player) {
      this.socket.emit(events.KICK_PLAYER, player.id);
    },
  },
  computed: {
    open() {
      return this.game && this.game.state === gameStates.WAITING_PLAYERS;
    },
  },
};
</script>

<style>
</style>