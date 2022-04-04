module.exports = (socket, ctx) => {
  socket.on("join-game", ({ claimToken, gameId }, callback) => {
    ctx.game = ctx.app.gameManager.findGameById(gameId);

    if (!ctx.game) {
      callback({
        type: "error",
        code: "game:not-found",
        message: "Game not found",
      });
      return;
    }

    ctx.me = ctx.game.findPlayerByClaimToken(claimToken);

    if (!ctx.me) {
      callback({
        type: "success",
        code: "game:need-player-info",
      });
      return;
    }

    if (ctx.me.hasSocket()) {
      const previousSocket = ctx.me.getSocket();
      previousSocket.disconnect();
    }

    ctx.me.attachSocket(socket);

    socket.join(ctx.game.id);

    callback({
      type: "success",
      code: "game:joined",
      me: ctx.me.toClientResource(),
      game: ctx.game.toClientResource(),
    });
  });

  socket.on("disconnect", () => {
    if (ctx.game && ctx.game.state === "wait-players") {
      const player = ctx.game.findPlayerBySocketId(socket.id);

      if (player) {
        ctx.game.removePlayerById(player.id);
      }
    }
  });
};
