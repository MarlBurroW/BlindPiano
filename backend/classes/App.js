const GameManager = require("./GameManager.js");
const PersonManager = require("./PersonManager.js");

class App {
  constructor() {
    this.gameManager = new GameManager();
    this.personManager = new PersonManager();
  }
}

module.exports = App;
