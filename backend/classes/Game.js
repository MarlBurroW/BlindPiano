const _ = require("lodash");
const EventEmitter = require("events");

class Game extends EventEmitter {
  constructor(id) {
    super();
    this.id = id;
    this.players = [];
    this.state = "wait-players";
    this.leaderId = null;
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
      this.emit("game-empty");
    }
  }

  addPlayer(player) {
    this.players.push(player);
    this.electLeader();
    this.emptyCheck();
    this.emit("player-added", player);
  }

  hasLeader() {
    return this.leaderId && this.findPlayerById(this.leaderId);
  }

  getLeader() {
    return _.find(this.players, (p) => p.id === this.leaderId);
  }

  electLeader() {
    if (!this.hasLeader()) {
      const player = _.first(this.players);
      if (player) {
        this.leaderId = player.id;
        this.emit("new-leader-elected", player);
      }
    }
  }

  removePlayerById(playerId) {
    const player = this.findPlayerById(playerId);
    if (player) {
      _.remove(this.players, (p) => p.id === player.id);
      this.electLeader();
      this.emptyCheck();
      this.emit("player-removed", player);
    }
  }

  findPlayerById(playerId) {
    return _.find(this.players, (p) => p.id === playerId);
  }

  findPlayerByClaimToken(claimToken) {
    return _.find(this.players, (p) => p.claimToken === claimToken);
  }

  toClientResource() {
    return {
      id: this.id,
      state: this.state,
      leaderId: this.leaderId,
      players: this.players.map((p) => p.toClientResource()),
    };
  }

  setState(state) {
    this.state = state;
    this.emit("state-changed", state);
  }

  start() {
    this.setState("started");
  }
}

module.exports = Game;
