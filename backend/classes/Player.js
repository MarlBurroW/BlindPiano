class Player {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.socket = null;
    this.claimToken = this.createToken();
  }

  send(event, payload, callback) {
    if (this.hasSocket()) {
      this.socket.emit(event, payload, callback);
    }
  }

  attachSocket(socket) {
    this.socket = socket;
  }

  hasSocket() {
    return !!this.socket;
  }

  getSocket() {
    return this.socket;
  }

  createToken() {
    return Math.random().toString(36).substr(2); // remove `0.`
  }

  toClientResource() {
    return {
      id: this.id,
      nickname: this.nickname,
    };
  }

  isLeaderOf(game) {
    return game.hasLeader() && game.leaderId == this.id;
  }
}

module.exports = Player;
