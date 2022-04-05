module.exports = (gameContext) => {
  return () => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (me.isLeaderOf(game)) {
      game.start();
    }
  };
};
