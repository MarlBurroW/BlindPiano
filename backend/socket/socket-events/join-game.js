const events = require("../../../events");
const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return ({ claimToken, gameId }) => {
    const game = gameContext.getApp().gameManager.findGameById(gameId);
    const socket = gameContext.getSocket();

    if (game) {
      gameContext.setGame(game);
    } else {
      socket.emit(events.GAME_NOT_FOUND);
      return;
    }

    const me = game.findPlayerByClaimToken(claimToken);

    if (me) {
      gameContext.setMe(me);
    } else {
      if (game.getState() !== gameStates.WAITING_PLAYERS) {
        socket.emit(events.GAME_ALREADY_STARTED);
        return;
      }

      socket.emit(events.ASK_NICKNAME);
      return;
    }

    // Kill previous socket attached
    if (me.isOnline()) {
      me.disconnect();
    }

    me.attachSocket(socket);

    socket.join(game.id);

    socket.emit(events.GAME_JOINED, {
      me: me.toClientResource(),
      game: game.toClientResource(),
    });

    game.gameUpdate();
  };
};
