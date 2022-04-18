const uuid = require("uuid");

class LogMessage {
  constructor(message, color) {
    this.id = uuid.v4();
    this.color = color;
    this.message = message;
  }

  toClientResource() {
    return {
      id: this.id,
      message: this.message,
      type: "log-message",
      color: this.color,
    };
  }
}

module.exports = LogMessage;
