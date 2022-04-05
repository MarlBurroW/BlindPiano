const uuid = require("uuid");
const Player = require("../classes/Player");

class PlayerManager {
  constructor() {}

  createPlayer(nickname, avatar) {
    const playerId = uuid.v4();

    const player = new Player(playerId, nickname, avatar);

    return player;
  }
}

module.exports = PlayerManager;
