module.exports = (socket, ctx) => {
  socket.on("game:kick-player", (playerId, callback) => {
    const game = ctx.game;
    const me = ctx.me;

    const player = game.findPlayerById(playerId);

    if (game.leaderId !== me.id) {
      callback({
        type: "error",
        code: "game:permission-denied",
        message: "Permission denied",
      });
      return;
    }

    if (player) {
      const playerSocket = player.getSocket();

      if (playerSocket) {
        player.send("message", {
          type: "error",
          message: "You have been banned",
        });
      }

      game.removePlayerById(player.id);

      callback({
        type: "success",
        code: "game:players:player-kicked",
      });
    } else {
      callback({
        type: "error",
        code: "game:player-not-found",
        message: "Player not found",
      });
    }
  });
};
