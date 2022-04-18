<template>
  <div class="waiting-players-screen fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title>
        <h1>Waiting for players</h1>
        <v-spacer></v-spacer>
        <v-btn
          x-large
          v-if="isLeader"
          :disabled="game.players.length < 2"
          class="primary"
          @click="startGame"
        >
          Start Game
        </v-btn>
      </v-card-title>
      <v-divider class="mb-5"></v-divider>
      <v-card-text v-if="game">
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

        <v-list subheader>
          <v-subheader
            >{{ game.players.length }}
            {{ game.players.length > 1 ? "players" : "player" }} in the
            party</v-subheader
          >

          <v-row>
            <v-col
              xs="12"
              sm="12"
              md="6"
              lg="4"
              :key="player.id"
              v-for="player in game.players"
            >
              <player-card
                :leader="player.id === game.leaderId"
                :player="player"
                :me="me"
                :game="game"
                @kick="kick($event)"
                @promote="promote($event)"
              ></player-card>
            </v-col>
          </v-row>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
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
    promote(player) {
      this.socket.emit(events.PROMOTE, player.id);
    },
  },
  computed: {},

  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.waiting-players-screen {
}
</style>