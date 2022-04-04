const { io } = require("../modules/server.js");
const app = require("../modules/app");

const gameAccess = require("./controllers/game-access");
const managePlayer = require("./controllers/manage-players");
const gameRunning = require("./controllers/game-running");

module.exports = {
  start() {
    console.log("Starting socket controller...");

    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`);

      const ctx = {
        game: null,
        me: null,
        app,
      };

      gameAccess(socket, ctx);
      managePlayer(socket, ctx);
      gameRunning(socket, ctx);
    });

    io.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  },
};
