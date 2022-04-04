const GameManager = require("./GameManager.js");
const PlayerManager = require("./PlayerManager.js");

class App {
  constructor() {
    this.gameManager = new GameManager();
    this.playerManager = new PlayerManager();
  }
}

module.exports = App;
