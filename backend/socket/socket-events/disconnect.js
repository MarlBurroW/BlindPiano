const events = require("../../../events");
const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return () => {
    const game = gameContext.getGame();
    const socket = gameContext.getSocket();
    const me = gameContext.getMe();

    if (game) {
      if (game.state === gameStates.WAITING_PLAYERS) {
        if (me) {
          game.removePlayerById(me.id);

          game.emit(events.PLAYER_DISCONNECTED, me.toClientResource());
        }
      } else {
        if (me) {
          me.detachSocket();
          game.gameUpdate();
          game.emit(events.PLAYER_DISCONNECTED, me.toClientResource());
        }
      }
    }
  };
};
