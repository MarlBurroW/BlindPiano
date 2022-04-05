const events = require("../../../events");
const ChatMessage = require("../../classes/ChatMessage");

module.exports = (gameContext) => {
  return (message) => {
    const game = gameContext.getGame();

    const me = gameContext.getMe();

    const chatMessage = new ChatMessage(me, message);

    game.emit(events.CHAT_MESSAGE, chatMessage.toClientResource());
  };
};
