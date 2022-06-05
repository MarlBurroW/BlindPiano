import events from "../events";
import gameStates from "../game_states";
export default class Game {
  constructor(gameData) {
    this.gameData = gameData;
    this.socket = null;
    console.log("NEW INSTANCE");
  }

  // SOCKET ACTIONS

  kick(player) {
    this.socket.emit(events.KICK_PLAYER, player.id);
  }

  promote(player) {
    this.socket.emit(events.PROMOTE, player.id);
  }

  startTurn() {
    this.socket.emit(events.START_TURN);
  }

  stopLearning() {
    this.socket.emit(events.STOP_LEARNING);
  }

  chooseSong(song) {
    this.socket.emit(events.CHOOSE_SONG, song.id);
  }

  restartGame() {
    this.socket.emit(events.RESTART_GAME);
  }

  // ACCESS METHODS

  setGameData(gameData) {
    this.gameData = gameData;
  }

  setSocket(socket) {
    this.socket = socket;
  }

  getCurrentTurn() {
    return this.gameData.state.turn;
  }

  getCurrentTurnPlayer() {
    return this.players.find((p) => {
      return p.id === this.turn.playerId;
    });
  }

  // CHECK METHODS

  hasState(state) {
    return this.gameData.state.type === state;
  }

  isLeader(person) {
    return person.id === this.gameData.leaderId;
  }

  isSpectator(person) {
    return person.spectator;
  }

  isPlayer(person) {
    return !this.isSpectator(person);
  }

  isTurnOf(player) {
    return this.turnPlayer.id === player.id;
  }

  // GETTERS

  get id() {
    return this.gameData.id;
  }

  get options() {
    return this.gameData.options;
  }

  get persons() {
    return this.gameData && this.gameData.persons
      ? this.gameData.persons.map((p) => {
          p.leader = this.gameData.leaderId == p.id;

          return p;
        })
      : [];
  }

  get players() {
    return this.persons
      .filter((p) => !p.spectator)
      .map((p) => {
        if (this.scores[p.id]) {
          p.score = this.scores[p.id];
        } else {
          p.score = 0;
        }

        if (this.turn && this.hasState(gameStates.PLAY_SONG_SCREEN)) {
          p.hasGuessedArtist = this.turn.artistWins[p.id];
          p.hasGuessedSong = this.turn.songWins[p.id];
        }

        return p;
      });
  }

  get scoreOrderedPlayers() {
    return this.players.sort((a, b) => {
      return b.score - a.score;
    });
  }

  get spectators() {
    return this.persons.filter((p) => p.spectator);
  }

  get countDown() {
    return this.gameData.state.countDown;
  }

  get turn() {
    return this.gameData.state.turn;
  }
  get progress() {
    return this.gameData.progress;
  }

  get scores() {
    return this.gameData.scores;
  }

  get turnPlayer() {
    return this.getCurrentTurnPlayer();
  }

  get song() {
    return this.turn.song;
  }
}
