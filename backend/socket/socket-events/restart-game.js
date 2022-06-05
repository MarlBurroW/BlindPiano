const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return () => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (me && game && game.state.type == gameStates.FINAL_SCREEN) {
      game.reset();
    }
  };
};
