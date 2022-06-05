class Person {
  constructor(id, nickname, avatar) {
    this.id = id;
    this.nickname = nickname;
    this.socket = null;
    this.claimToken = this.createToken();
    this.color = null;
    this.avatar = avatar;
    this.deviceName = null;
    this.instrument = "piano";
    this.preset = null;
    this.spectator = false;
  }

  setDeviceName(name) {
    this.deviceName = name;
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

  setInstrument(instrument) {
    this.instrument = instrument;
  }

  getInstrument() {
    return this.instrument;
  }

  setPreset(preset) {
    this.preset = preset;
  }

  getPreset() {
    return this.preset;
  }

  toClientResource() {
    return {
      id: this.id,
      spectator: this.spectator,
      online: this.isOnline(),
      nickname: this.nickname,
      avatar: this.avatar,
      color: this.color,
      deviceName: this.deviceName,
      instrument: this.instrument,
      preset: this.preset,
    };
  }
}

module.exports = Person;
