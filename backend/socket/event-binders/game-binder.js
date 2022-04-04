const { io } = require("../../modules/server.js");

module.exports = (game) => {
  function broadcast(event, payload) {
    return io.to(game.id).emit(event, payload);
  }

  game.on("player-added", (player) => {
    broadcast("game:update", game.toClientResource());
  });

  game.on("player-removed", (player) => {
    broadcast("game:update", game.toClientResource());

    if (player.hasSocket()) {
      player.socket.disconnect();
    }
  });

  game.on("new-leader-elected", (player) => {
    player.send("message", {
      type: "info",
      message: "You have been promoted as leader",
    });
  });

  game.on("state-changed", (state) => {
    broadcast("game:update", game.toClientResource());
  });
};
