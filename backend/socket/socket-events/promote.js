const events = require("../../../events");

module.exports = (gameContext) => {
  return (playerId) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const player = game.findPlayerById(playerId);
    const socket = gameContext.getSocket();

    if (!me.isLeaderOf(game)) {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Permission denied",
      });
      return;
    }

    if (player) {
      game.promote(player);

      game.emitToPlayer(player, events.MESSAGE, {
        type: "info",
        message: "You have been promoted has leader",
      });

      socket.emit(events.MESSAGE, {
        type: "success",
        message: "Player promoted!",
      });
    } else {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Player not found",
      });
    }
  };
};
