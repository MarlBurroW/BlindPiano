const uuid = require("uuid");

class ChatMessage {
  constructor(player, message) {
    this.id = uuid.v4();
    this.player = player;
    this.message = message;
  }

  toClientResource() {
    return {
      id: this.id,
      nickname: this.player.nickname,
      playerId: this.player.id,
      message: this.message,
      color: this.player.color,
    };
  }
}

module.exports = ChatMessage;
