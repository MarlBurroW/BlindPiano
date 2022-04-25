module.exports = (gameContext) => {
  return (instrument) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    me.setInstrument(instrument);

    game.gameUpdate();
  };
};
