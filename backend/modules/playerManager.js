const uuid = require("uuid");
const Player = require("../classes/player");
module.exports = {
  createPlayer(nickname) {
    const playerId = uuid.v4();

    const player = new Player(playerId, nickname);

    return player;
  },
};
