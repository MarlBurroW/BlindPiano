const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return (val) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (me && game && game.state.type == gameStates.WAITING_PLAYERS_SCREEN) {
      me.spectator = !me.spectator;

      game.gameUpdate();
    }
  };
};
