const events = require("../../../events");

module.exports = (gameContext) => {
  return (key) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const socket = gameContext.getSocket();

    key.color = me && me.color ? me.color : null;

    socket.broadcast.to(game.id).emit(events.KEY_PRESSED, key);
  };
};
