const events = require("../../../events");

module.exports = (gameContext) => {
  return (playerId) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const player = game.findPlayerById(playerId);
    const socket = gameContext.getSocket();

    console.log(me.id, game.leaderId);

    if (!me.isLeaderOf(game)) {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Permission denied",
      });
      return;
    }

    if (player) {
      game.emitToPlayer(player, events.MESSAGE, {
        type: "error",
        message: "You have been banned",
      });

      player.disconnect();

      game.removePlayerById(player.id);

      socket.emit(events.MESSAGE, {
        type: "success",
        message: "Player kicked out!",
      });
    } else {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Player not found",
      });
    }
  };
};
