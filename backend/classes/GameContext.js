class GameContext {
  constructor() {
    this.app = null;
    this.game = null;
    this.me = null;
    this.socket = null;
    this.io = null;
  }
  setApp(app) {
    this.app = app;
  }
  setSocket(socket) {
    this.socket = socket;
  }
  setGame(game) {
    this.game = game;
  }
  setMe(me) {
    this.me = me;
  }

  setIO(io) {
    this.io = io;
  }

  getApp() {
    return this.app;
  }
  getSocket() {
    return this.socket;
  }
  getGame() {
    return this.game;
  }
  getMe() {
    return this.me;
  }

  getIO() {
    return this.me;
  }

  broadcast(event, payload) {
    if (this.game) {
      this.io.to(this.game.id).emit(event, payload);
    }
  }
}

module.exports = GameContext;
