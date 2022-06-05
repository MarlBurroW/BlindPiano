const events = require("../../../events");

module.exports = (gameContext) => {
  return (personId) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const person = game.findPersonById(personId);
    const socket = gameContext.getSocket();

    if (!me.isLeaderOf(game)) {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Permission denied",
      });
      return;
    }

    if (person) {
      game.promote(person);

      game.emitToPerson(person, events.MESSAGE, {
        type: "info",
        message: "You have been promoted has leader",
      });

      socket.emit(events.MESSAGE, {
        type: "success",
        message: "Player promoted!",
      });
    } else {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Player not found",
      });
    }
  };
};
