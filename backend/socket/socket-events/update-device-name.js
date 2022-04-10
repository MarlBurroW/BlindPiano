module.exports = (gameContext) => {
  return (deviceName) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    me.setDeviceName(deviceName);

    game.gameUpdate();
  };
};
