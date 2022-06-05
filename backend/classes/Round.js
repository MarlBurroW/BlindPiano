const _ = require("lodash");
const Turn = require("../classes/Turn");

class Round {
  constructor(players, num) {
    this.players = players;
    this.turns = [];
    this.currentTurn = null;
    this.currentPlayerTurn = null;
    this.number = num;
    this.name = `Round ${num}`;

    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      this.turns.push(new Turn(player));
    }

    // this.shuffle();
  }

  isFinished() {
    return this.turns.filter((t) => t.finished == false).length == 0;
  }

  removeTurnByPlayerId(playerId) {
    this.turns = this.turns.filter((t) => playerId != t.player.id);
  }

  shuffle() {
    this.turns = _.shuffle(this.turns);
  }

  toClientResource() {
    return {
      name: this.name,
      number: this.number,
      finished: this.isFinished(),
    };
  }
}

module.exports = Round;
