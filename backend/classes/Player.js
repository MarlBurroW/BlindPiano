class Player {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.socket = null;
    this.claimToken = this.createToken();
  }

  isLeaderOf(game) {
    return game.leaderId === this.id;
  }

  attachSocket(socket) {
    this.socket = socket;
  }

  disconnect() {
    if (this.isOnline()) {
      this.socket.disconnect();
      this.detachSocket();
    }
  }

  detachSocket() {
    this.socket = null;
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

  isLeaderOf(game) {
    return game.hasLeader() && game.leaderId == this.id;
  }

  isOnline() {
    return this.hasSocket() && this.socket.connected;
  }
  isOffline() {
    return !this.isOnline();
  }

  toClientResource() {
    return {
      id: this.id,
      online: this.isOnline(),
      nickname: this.nickname,
    };
  }
}

module.exports = Player;
