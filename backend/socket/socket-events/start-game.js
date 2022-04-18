module.exports = (gameContext) => {
  return () => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (me && me.isLeaderOf(game)) {
      game.start();
    }
  };
};
