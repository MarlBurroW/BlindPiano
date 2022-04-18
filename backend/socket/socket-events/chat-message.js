const events = require("../../../events");
const ChatMessage = require("../../classes/ChatMessage");

module.exports = (gameContext) => {
  return (message) => {
    const game = gameContext.getGame();

    const me = gameContext.getMe();

    game.chatMessage(me, message);
  };
};
