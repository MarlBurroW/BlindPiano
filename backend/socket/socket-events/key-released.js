const events = require("../../../events");

module.exports = (gameContext) => {
  return (key) => {
    const game = gameContext.getGame();

    const socket = gameContext.getSocket();

    socket.broadcast.to(game.id).emit(events.KEY_RELEASED, key);
  };
};
