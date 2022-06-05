<template>
  <div class="waiting-players-screen fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title>
        <h1>Waiting for players</h1>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="spectator" x-large class="mr-2">
          {{ me.spectator ? "Become a player" : "Become a spectator" }}
          <v-icon right>{{
            me.spectator ? "mdi-controller-classic" : "mdi-eye"
          }}</v-icon></v-btn
        >
        <v-btn
          x-large
          v-if="game.isLeader(me)"
          :disabled="game.players.length < 2"
          class="primary"
          @click="startGame"
        >
          Start Game <v-icon right>mdi-send</v-icon>
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
      </v-card-text>

      <v-card-text>
        <h2 class="mb-5">Game options</h2>

        <v-row>
          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.roundCount"
              @change="updateOptions"
              :items="roundCountItems"
              :disabled="!game.isLeader(me)"
              label="Number of round(s)"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.learnTime"
              @change="updateOptions"
              :items="learningDurationItems"
              :disabled="!game.isLeader(me)"
              label="Learning song duration"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.playTime"
              @change="updateOptions"
              :items="playTimeItems"
              :disabled="!game.isLeader(me)"
              label="Play/Guess song duration"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.chooseTime"
              @change="updateOptions"
              :items="chooseTimeItems"
              :disabled="!game.isLeader(me)"
              label="Choosing song duration"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.chooseCount"
              @change="updateOptions"
              :items="chooseCountItems"
              :disabled="!game.isLeader(me)"
              label="Song choices"
              outlined
            ></v-select>
          </v-col>
          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.guessArtistPoints"
              @change="updateOptions"
              :items="guessArtistPointsItems"
              :disabled="!game.isLeader(me)"
              label="Points a player earn when he guess the artist"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.guessSongPoints"
              @change="updateOptions"
              :items="guessSongPointsItems"
              :disabled="!game.isLeader(me)"
              label="Points a player earn when he guess the song"
              outlined
            ></v-select>
          </v-col>

          <v-col xl="4" md="6" sm="12">
            <v-select
              v-model="gameOptions.someoneGuessMyPlayPoints"
              @change="updateOptions"
              :items="someoneGuessMyPlayPointsItems"
              :disabled="!game.isLeader(me)"
              label="Points a player earn when another player guess his song/artist"
              outlined
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import contextMixin from "../mixins/context-mixin";
import gameStates from "../game_states";
import events from "../events";
import _ from "lodash";

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

export default {
  mixins: [contextMixin],

  methods: {
    updateOptions() {
      this.socket.emit(events.UPDATE_GAME_OPTIONS, this.gameOptions);
    },
    startGame() {
      this.socket.emit(events.START_GAME);
    },
    kick(player) {
      this.socket.emit(events.KICK_PLAYER, player.id);
    },
    promote(player) {
      this.socket.emit(events.PROMOTE, player.id);
    },
    spectator() {
      this.socket.emit(events.SPECTATOR);
    },
  },
  computed: {},
  watch: {
    "game.options": {
      immediate: true,
      handler(options) {
        this.gameOptions = options;
      },
    },
  },
  data() {
    return {
      gameOptions: {},
      roundCountItems: [
        { text: "1 Round", value: 1 },
        { text: "2 Rounds", value: 2 },
        { text: "3 Rounds", value: 3 },
        { text: "4 Rounds", value: 4 },
        { text: "5 Rounds", value: 5 },
        { text: "6 Rounds", value: 6 },
        { text: "7 Rounds", value: 7 },
        { text: "8 Rounds", value: 8 },
        { text: "9 Rounds", value: 9 },
        { text: "10 Rounds", value: 10 },
      ],
      learningDurationItems: Array.from({ length: 60 }, (_, i) => i + 1).map(
        (i) => {
          return {
            value: i * 10,
            text: `${fmtMSS(i * 10)}`,
          };
        }
      ),
      playTimeItems: Array.from({ length: 60 }, (_, i) => i + 1).map((i) => {
        return {
          value: i * 10,
          text: `${fmtMSS(i * 10)}`,
        };
      }),
      chooseTimeItems: Array.from({ length: 60 }, (_, i) => i + 1).map((i) => {
        return {
          value: i * 10,
          text: `${fmtMSS(i * 10)}`,
        };
      }),
      guessArtistPointsItems: Array.from({ length: 100 }, (_, i) => i + 1).map(
        (i) => {
          return {
            value: i * 10,
            text: `${i * 10} Points`,
          };
        }
      ),
      guessSongPointsItems: Array.from({ length: 100 }, (_, i) => i + 1).map(
        (i) => {
          return {
            value: i * 10,
            text: `${i * 10} Points`,
          };
        }
      ),
      someoneGuessMyPlayPointsItems: Array.from(
        { length: 100 },
        (_, i) => i + 1
      ).map((i) => {
        return {
          value: i * 10,
          text: `${i * 10} Points`,
        };
      }),

      chooseCountItems: Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
        return {
          value: i,
          text: `${i} Choice${i > 1 ? "s" : ""}`,
        };
      }),

      optionDialog: false,
    };
  },
};
</script>

<style scoped lang="scss">
</style>