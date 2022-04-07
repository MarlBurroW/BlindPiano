const events = require("../../../events");

module.exports = (gameContext) => {
  return (playerId) => {
    const game = gameContext.getGame();
    const me = gameContext.getMe();
    const player = game.findPlayerById(playerId);
    const socket = gameContext.getSocket();
  };
};
