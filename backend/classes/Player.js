class Player {
  constructor(id, nickname, avatar) {
    this.id = id;
    this.nickname = nickname;
    this.socket = null;
    this.claimToken = this.createToken();
    this.color = null;
    this.avatar = avatar;
  }

  setColor(color) {
    this.color = color;
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
      avatar: this.avatar,
      color: this.color,
    };
  }
}

module.exports = Player;
