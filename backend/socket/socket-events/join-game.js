const events = require("../../../events");
const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return ({ claimToken, gameId }) => {
    const game = gameContext.getApp().gameManager.findGameById(gameId);
    const socket = gameContext.getSocket();

    if (!game) {
      socket.emit(events.GAME_NOT_FOUND);
      return;
    }

    if (game && game.getStateKey() == gameStates.FINISHED) {
      socket.emit(events.GAME_FINISHED);
      return;
    }

    gameContext.setGame(game);

    const me = game.findPlayerByClaimToken(claimToken);

    if (me) {
      gameContext.setMe(me);
    } else {
      socket.emit(events.ASK_NICKNAME);
      return;
    }

    me.attachSocket(socket);

    socket.join(game.id);

    socket.emit(events.GAME_JOINED, {
      me: me.toClientResource(),
      game: game.toClientResource(),
    });

    game.emit(events.PLAYER_JOINED, me.toClientResource());

    game.gameUpdate();
  };
};
