module.exports = (gameContext) => {
  return (preset) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    me.setPreset(preset);

    game.gameUpdate();
  };
};
