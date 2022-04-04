const uuid = require("uuid");
const Player = require("../classes/Player");

class PlayerManager {
  constructor() {}

  createPlayer(nickname) {
    const playerId = uuid.v4();

    const player = new Player(playerId, nickname);

    return player;
  }
}

module.exports = PlayerManager;
