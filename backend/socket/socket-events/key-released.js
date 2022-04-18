const events = require("../../../events");

module.exports = (gameContext) => {
  return (key) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();

    if (game && me) {
      game.unpressKey(key, me);
    }
  };
};
