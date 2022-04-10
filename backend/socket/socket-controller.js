const { io } = require("../modules/server.js");
const app = require("../modules/app");
const GameContext = require("../classes/GameContext");

const Game = require("../classes/Game.js");

const disconnect = require("./socket-events/disconnect");
const joinGame = require("./socket-events/join-game");
const kickPlayer = require("./socket-events/kick-player");
const startGame = require("./socket-events/start-game");
const chatMessage = require("./socket-events/chat-message");
const promote = require("./socket-events/promote");
const updateDeviceName = require("./socket-events/update-device-name");
const keyPressed = require("./socket-events/key-pressed");
const keyReleased = require("./socket-events/key-released");

const events = require("../../events");

module.exports = {
  start() {
    console.log("Starting socket controller...");

    io.on("connection", (socket) => {
      console.log(`Socket ${socket.id} connected`);

      const gameContext = new GameContext();

      gameContext.setApp(app);
      gameContext.setIO(io);
      gameContext.setSocket(socket);

      socket.on(events.DISCONNECT, disconnect(gameContext));
      socket.on(events.JOIN_GAME, joinGame(gameContext));
      socket.on(events.KICK_PLAYER, kickPlayer(gameContext));
      socket.on(events.START_GAME, startGame(gameContext));
      socket.on(events.CHAT_MESSAGE, chatMessage(gameContext));
      socket.on(events.PROMOTE, promote(gameContext));
      socket.on(events.UPDATE_DEVICE_NAME, updateDeviceName(gameContext));
      socket.on(events.KEY_PRESSED, keyPressed(gameContext));
      socket.on(events.KEY_RELEASED, keyReleased(gameContext));
    });
  },
};
