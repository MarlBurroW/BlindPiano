module.exports = (socket, ctx) => {
  socket.on("game:start", () => {
    const game = ctx.game;
    const me = ctx.me;

    if (me.isLeaderOf(game)) {
      game.start();
    }
  });
};
