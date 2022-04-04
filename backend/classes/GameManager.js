const uuid = require("uuid");
const Game = require("../classes/Game");
const _ = require("lodash");
const gameBinder = require("../socket/event-binders/game-binder");

class GameManager {
  constructor() {
    this.games = [];
  }

  createGame() {
    const gameId = uuid.v4();

    const game = new Game(gameId);

    gameBinder(game);

    return game;
  }

  removeGameById(gameId) {
    _.remove(this.games, (g) => g.id === gameId);
  }

  addGame(game) {
    this.games.push(game);

    game.on("game-empty", () => {
      this.removeGameById(game.id);
    });
  }

  findGameById(gameId) {
    return _.find(this.games, (g) => g.id == gameId);
  }
}

module.exports = GameManager;
