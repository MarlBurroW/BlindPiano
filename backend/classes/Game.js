const _ = require("lodash");
const events = require("../../events");
const gameStates = require("../../game_states");

class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.state = gameStates.WAITING_PLAYERS;
    this.leaderId = null;
    this.io = null;
    this.playerColors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#607D8B",
    ];
  }

  setIO(io) {
    this.io = io;
  }

  emit(event, payload) {
    this.io.to(this.id).emit(event, payload);
  }

  emitToPlayer(player, event, payload) {
    if (player.isOnline()) {
      this.io.to(player.getSocket().id).emit(event, payload);
    }
  }

  findPlayerBySocketId(socketId) {
    return _.find(
      this.players.filter((p) => p.socket),
      (p) => p.socket.id === socketId
    );
  }

  playerCount() {
    return this.players.length;
  }

  emptyCheck() {
    if (this.playerCount() < 1) {
      // this.emit("game-empty");
    }
  }

  getAvailableColor() {
    const alreadyUsedColors = this.players
      .filter((p) => p.color)
      .map((p) => p.color);

    return _.difference(this.playerColors, alreadyUsedColors);
  }

  addPlayer(player) {
    this.players.push(player);
    player.setColor(_.sample(this.getAvailableColor()));
    this.electNewLeaderIfNeeded();
    this.emptyCheck();
    this.gameUpdate();
  }

  hasLeader() {
    if (this.leaderId) {
      const leader = this.getLeader();

      return leader && leader.isOnline();
    }

    return false;
  }

  getLeader() {
    return _.find(this.players, (p) => p.id === this.leaderId);
  }

  electNewLeaderIfNeeded() {
    if (!this.hasLeader()) {
      const player = _.first(this.players);
      if (player) {
        this.leaderId = player.id;
        this.gameUpdate();
      }
    }
  }

  gameUpdate() {
    this.emit(events.GAME_UPDATED, this.toClientResource());
  }

  removePlayerById(playerId) {
    const player = this.findPlayerById(playerId);
    if (player) {
      _.remove(this.players, (p) => p.id === player.id);
      this.electNewLeaderIfNeeded();
      this.emptyCheck();
      this.gameUpdate();
    }
  }

  findPlayerById(playerId) {
    return _.find(this.players, (p) => p.id === playerId);
  }

  findPlayerByClaimToken(claimToken) {
    return _.find(this.players, (p) => p.claimToken === claimToken);
  }

  setState(state) {
    this.state = state;

    this.players = _.shuffle(this.players);

    this.gameUpdate();
  }

  getState() {
    return this.state;
  }

  start() {
    this.setState("running");
    this.gameUpdate();
  }

  promote(player) {
    if (this.findPlayerById(player.id)) {
      this.leaderId = player.id;
      this.gameUpdate();
    }
  }

  toClientResource() {
    return {
      id: this.id,
      state: this.state,
      leaderId: this.leaderId,
      players: this.players.map((p) => p.toClientResource()),
    };
  }
}

module.exports = Game;
