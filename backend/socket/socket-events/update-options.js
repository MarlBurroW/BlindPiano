module.exports = (gameContext) => {
  return (options) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    if (me.isLeaderOf(game)) {
      game.updateOptions(options);
    }
  };
};
