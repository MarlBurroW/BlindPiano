const events = require("../../../events");
const gameStates = require("../../../game_states");

module.exports = (gameContext) => {
  return ({ claimToken, gameId }) => {
    const game = gameContext.getApp().gameManager.findGameById(gameId);
    const socket = gameContext.getSocket();

    console.log(
      `Socket ${socket.id} joining game ${gameId} with claimToken ${claimToken}`
    );

    if (!game) {
      console.log(`Game ${gameId} not found`);
      socket.emit(events.GAME_NOT_FOUND);
      return;
    }

    if (game && game.getStateKey() == gameStates.FINISHED) {
      socket.emit(events.GAME_FINISHED);
      return;
    }

    gameContext.setGame(game);

    const me = game.findPersonByClaimToken(claimToken);

    if (me) {
      console.log(
        `User  ${me.nickname} found  for the claim token ${claimToken}`
      );
      gameContext.setMe(me);
    } else {
      console.log(
        `No user found for the claim token ${claimToken}, asking nickname`
      );
      socket.emit(events.ASK_NICKNAME);
      return;
    }

    console.log(`Attaching socket ${socket.id} to the user ${me.nickname}`);
    me.attachSocket(socket);

    console.log(`Make socket ${socket.id} joining the room ${game.id}`);
    socket.join(game.id);

    if (game.state.type != gameStates.WAITING_PLAYERS_SCREEN) {
      console.log(`Game already started, set ${me.nickname} as spectator`);
      me.spectator = true;
    }

    socket.emit(events.GAME_JOINED, {
      me: me.toClientResource(),
      game: game.toClientResource(),
    });

    game.emit(events.PLAYER_JOINED, me.toClientResource());

    game.gameUpdate();
  };
};
