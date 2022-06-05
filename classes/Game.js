export default class Game {
  constructor(gameData) {
    this.gameData = gameData;
  }

  setGameData(gameDate) {
    this.gameData = gameData;
  }

  get id() {
    return this.gameData.id;
  }

  get persons() {
    return this.gameData && this.gameData.persons
      ? this.gameData.persons.map((p) => {
          if (this.gameData.socres && this.gameData.socres[p.id]) {
            p.score = this.gameData.socres[p.id];
          }

          p.leader = this.gameData.leaderId == p.id;

          return p;
        })
      : [];
  }

  get players() {
    return this.persons.filter((p) => !p.spectator);
  }

  get spectators() {
    return this.persons.filter((p) => p.spectator);
  }

  hasState(state) {
    return this.gameData.state.type === state;
  }

  get countDown() {
    return this.gameData.state.countDown;
  }

  get turn() {
    return this.gameData.state.turn;
  }

  get turnPlayer() {
    return this.getCurrentTurnPlayer();
  }

  getCurrentTurn() {
    return this.gameData.state.turn;
  }

  getCurrentTurnPlayer() {
    return this.players.find((p) => {
      return p.id === this.turn.playerId;
    });
  }

  get progress() {
    return this.gameData.progress;
  }
}
