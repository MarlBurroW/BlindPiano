const uuid = require("uuid");
const Game = require("../classes/Game");
const _ = require("lodash");

const { io } = require("../modules/server.js");

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame() {
    const gameId = uuid.v4();

    const game = new Game(gameId);

    return game;
  }

  removeGameById(gameId) {
    _.remove(this.games, (g) => g.id === gameId);
  }

  addGame(game) {
    this.games.push(game);

    game.setIO(io);
  }

  findGameById(gameId) {
    return _.find(this.games, (g) => g.id == gameId);
  }
}

module.exports = GameManager;
