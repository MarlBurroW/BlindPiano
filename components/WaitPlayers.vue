<template>
  <div class="waiting-players-screen fill-height">
    <v-card fill-height class="fill-height pa-10">
      <v-card-title>
        <h1>Waiting for players</h1>
        <v-spacer></v-spacer>

        <v-btn @click="optionDialog = !optionDialog" x-large class="mr-2"
          ><v-icon left>mdi-cog</v-icon> Options
        </v-btn>

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
      </v-card-text>

      <v-card-text>
        <v-btn @click="spectator">Spectate</v-btn>
      </v-card-text>
    </v-card>

    <v-dialog v-model="optionDialog" width="500">
      <v-card>
        <v-toolbar>
          <v-toolbar-title
            ><v-icon>mdi-cog</v-icon> Game Options
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn icon @click="optionDialog = false"
            ><v-icon>mdi-close</v-icon></v-btn
          >
        </v-toolbar>

        <v-card-text class="px-5 py-5" v-if="gameOptions">
          <v-select
            v-model="gameOptions.roundCount"
            @change="updateOptions"
            :items="roundCountItems"
            :disabled="!isLeader"
            label="Number of round(s)"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.learnTime"
            @change="updateOptions"
            :items="learningDurationItems"
            :disabled="!isLeader"
            label="Learning song duration"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.playTime"
            @change="updateOptions"
            :items="playTimeItems"
            :disabled="!isLeader"
            label="Play/Guess song duration"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.chooseTime"
            @change="updateOptions"
            :items="chooseTimeItems"
            :disabled="!isLeader"
            label="Choosing song duration"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.chooseCount"
            @change="updateOptions"
            :items="chooseCountItems"
            :disabled="!isLeader"
            label="Song choices"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.guessArtistPoints"
            @change="updateOptions"
            :items="guessArtistPointsItems"
            :disabled="!isLeader"
            label="Points a player earn when he guess the artist"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.guessSongPoints"
            @change="updateOptions"
            :items="guessSongPointsItems"
            :disabled="!isLeader"
            label="Points a player earn when he guess the song"
            outlined
          ></v-select>

          <v-select
            v-model="gameOptions.someoneGuessMyPlayPoints"
            @change="updateOptions"
            :items="someoneGuessMyPlayPointsItems"
            :disabled="!isLeader"
            label="Points a player earn when another player guess his song/artist"
            outlined
          ></v-select>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="optionDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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