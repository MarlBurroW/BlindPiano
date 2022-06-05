const events = require("../../../events");

module.exports = (gameContext) => {
  return (personId) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const player = game.findPersonById(personId);
    const socket = gameContext.getSocket();
  };
};
