module.exports = (gameContext) => {
  return (payload) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (game && me) {
      game.holdPedal(payload, me);
    }
  };
};
