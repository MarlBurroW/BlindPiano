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
      game.emitToPerson(person, events.MESSAGE, {
        type: "error",
        message: "You have been kicked",
      });

      person.disconnect();

      game.removePersonById(person.id);

      socket.emit(events.MESSAGE, {
        type: "success",
        message: "Player kicked out!",
      });
    } else {
      socket.emit(events.MESSAGE, {
        type: "error",
        message: "Player not found",
      });
    }
  };
};
