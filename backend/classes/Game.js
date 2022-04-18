const _ = require("lodash");
const events = require("../../events");
const gameStates = require("../../game_states");
const songPicker = require("../modules/song-picker");
const Round = require("../classes/Round");
const LogMessage = require("./LogMessage");
const ChatMessage = require("./ChatMessage");
const stringSimilarity = require("string-similarity");
class Game {
  constructor(id) {
    this.id = id;
    this.players = [];
    this.state = {
      type: gameStates.WAITING_PLAYERS,
    };

    this.scores = {};

    this.guessArtistPoints = 50;
    this.guessSongPoints = 50;
    this.someoneGuessMyPlayPoints = 60;

    this.leaderId = null;
    this.io = null;
    this.guessSimilarityThreshold = 0.5;
    this.roundCount = 3;
    this.learnTime = 60;
    this.playTime = 60;
    this.ticTime = 5;
    this.preturnTime = 5;
    this.responseTime = 5;
    this.rounds = [];
    this.currentRound = null;

    this.counterInterval = null;
    this.playedSongs = [];
    this.playerColors = [
      "#F44336",
      "#E91E63",
      "#9C27B0",
      "#673AB7",
      "#3F51B5",
      "#2196F3",
      "#03A9F4",
      "#00BCD4",
      "#009688",
      "#4CAF50",
      "#CDDC39",

      "#FFC107",
      "#FF9800",
      "#FF5722",
      "#795548",
      "#607D8B",
    ];
  }

  setIO(io) {
    this.io = io;
  }

  emit(event, payload) {
    this.io.to(this.id).emit(event, payload);
  }

  emitToPlayer(player, event, payload) {
    if (player.isOnline()) {
      this.io.to(player.getSocket().id).emit(event, payload);
    }
  }

  findPlayerBySocketId(socketId) {
    return _.find(
      this.players.filter((p) => p.socket),
      (p) => p.socket.id === socketId
    );
  }

  playerCount() {
    return this.players.length;
  }

  emptyCheck() {
    if (this.playerCount() < 1) {
      this.state = {
        type: gameStates.FINISHED,
      };
    }
  }

  getAvailableColor() {
    const alreadyUsedColors = this.players
      .filter((p) => p.color)
      .map((p) => p.color);

    return _.difference(this.playerColors, alreadyUsedColors);
  }

  addPlayer(player) {
    this.players.push(player);
    player.setColor(_.sample(this.getAvailableColor()));
    this.electNewLeaderIfNeeded();
    this.emptyCheck();
    this.gameUpdate();

    this.log(`${player.nickname} has joined the game`);
  }

  hasLeader() {
    if (this.leaderId) {
      const leader = this.getLeader();

      return leader && leader.isOnline();
    }

    return false;
  }

  getLeader() {
    return _.find(this.players, (p) => p.id === this.leaderId);
  }

  electNewLeaderIfNeeded() {
    if (!this.hasLeader()) {
      const player = _.first(this.players);
      if (player) {
        this.leaderId = player.id;
        this.gameUpdate();
        this.log(`${player.nickname} has been promoted as leader`);
      }
    }
  }

  gameUpdate() {
    this.emit(events.GAME_UPDATED, this.toClientResource());
  }

  removeTurnsByPlayerId(playerId) {
    for (let i = 0; i < this.rounds.length; i++) {
      const round = this.rounds[i];
      round.removeTurnByPlayerId(playerId);
    }
  }

  removePlayerById(playerId) {
    const player = this.findPlayerById(playerId);
    if (player) {
      _.remove(this.players, (p) => p.id === player.id);
      this.electNewLeaderIfNeeded();
      this.emptyCheck();
      this.removeTurnsByPlayerId(player.id);

      const turn = this.getCurrentTurn();
      if (turn && turn.player.id == player.id) {
        turn.finish();
        clearInterval(this.counterInterval);

        const nextTurn = this.getCurrentTurn();
        this.startTurn(nextTurn);
      }

      this.gameUpdate();

      this.log(`${player.nickname} has left the game`);
    }
  }

  findPlayerById(playerId) {
    return _.find(this.players, (p) => p.id === playerId);
  }

  findPlayerByClaimToken(claimToken) {
    return _.find(this.players, (p) => p.claimToken === claimToken);
  }

  setState(state) {
    this.state = state;

    this.players = _.shuffle(this.players);

    this.gameUpdate();
  }

  getState() {
    return this.state;
  }

  getStateKey() {
    return this.state.type;
  }

  getCurrentRound() {
    return this.rounds.find((r) => r.isFinished() === false);
  }

  getCurrentTurn() {
    const currentRound = this.getCurrentRound();

    if (currentRound) {
      return currentRound.turns.find((t) => t.finished === false);
    }
    return null;
  }

  startPreTurn(turn) {
    return new Promise((resolve) => {
      let counter = this.preturnTime;

      this.setState({
        type: gameStates.PRE_TURN,
        round: this.getCurrentRound().toClientResource(),
        turn: turn.toClientResource(),
        countDown: counter,
      });

      this.gameUpdate();

      this.counterInterval = setInterval(() => {
        counter--;
        this.emit(events.UPDATE_COUNTDOWN, counter);
        this.state.countDown = counter;

        if (counter <= this.ticTime) {
          this.emit(events.PLAY_SFX, "tic");
        }

        if (counter <= 0) {
          this.emit(events.PLAY_SFX, "start");
          clearInterval(this.counterInterval);
          resolve(turn);
        }
      }, 1000);
    });
  }

  startLearningSong(turn) {
    this.log(`${turn.player.nickname}'s turn started`);

    return new Promise((resolve, reject) => {
      let counter = this.learnTime;

      this.state = {
        type: gameStates.LEARNING_SONG,
        round: this.getCurrentRound().toClientResource(),
        turn: turn.toPrivateResource(),
        countDown: counter,
      };

      this.gameUpdate();

      const song = songPicker.getRandomSongExcluding(this.playedSongs);

      turn.setSong(song);

      this.playedSongs.push(song.id);

      this.emitToPlayer(
        turn.player,
        events.PRIVATE_TURN_INFO,
        turn.toPrivateResource()
      );

      const playerSocket = turn.player.getSocket();

      playerSocket.on(events.STOP_LEARNING, () => {
        playerSocket.offAny(events.STOP_LEARNING);
        counter = 6;
      });

      this.counterInterval = setInterval(() => {
        counter--;
        this.emit(events.UPDATE_COUNTDOWN, counter);
        this.state.countDown = counter;
        if (counter <= this.ticTime) {
          this.emit(events.PLAY_SFX, "tic");
        }
        if (counter <= 0) {
          clearInterval(this.counterInterval);

          this.emitToPlayer(turn.player, events.PRIVATE_TURN_INFO, null);
          this.emit(events.PLAY_SFX, "start");
          resolve(turn);
        }
      }, 1000);
    });
  }

  startPlaySong(turn) {
    this.log(`Time to guess the song ! Type your guesses here`);
    return new Promise((resolve, reject) => {
      let counter = this.playTime;

      this.state = {
        type: gameStates.PLAY_SONG,
        round: this.getCurrentRound().toClientResource(),
        turn: turn.toPrivateResource(),
        countDown: counter,
      };

      this.gameUpdate();

      this.counterInterval = setInterval(() => {
        counter--;
        this.emit(events.UPDATE_COUNTDOWN, counter);
        this.state.countDown = counter;
        if (counter <= this.ticTime) {
          this.emit(events.PLAY_SFX, "tic");
        }
        if (counter <= 0) {
          clearInterval(this.counterInterval);
          this.emit(events.PLAY_SFX, "start");
          resolve(turn);
        }
      }, 1000);
    });
  }

  startTurn(turn) {
    this.startScoreScreen
      .bind(this)(turn)
      .then(this.startPreTurn.bind(this))
      .then(this.startLearningSong.bind(this))
      .then(this.startPlaySong.bind(this))
      .then(this.startResponseScreen.bind(this))
      .then(this.finishTurn.bind(this));
  }

  finishTurn(turn) {
    return new Promise((resolve, reject) => {
      turn.finish();

      const nextTurn = this.getCurrentTurn();

      if (nextTurn) {
        this.startTurn(nextTurn);
      } else {
        this.setState({
          type: gameStates.FINAL_SCREEN,
        });

        this.log(`Game is finished !`);
      }

      resolve(turn);
    });
  }

  startScoreScreen(turn) {
    return new Promise((resolve, reject) => {
      this.setState({
        type: gameStates.SCORES_SCREEN,
        turn: turn.toClientResource(),
        round: this.getCurrentRound().toClientResource(),
      });

      const playerSocket = turn.player.socket;

      playerSocket.on(events.START_TURN, () => {
        playerSocket.offAny(events.START_TURN);
        resolve(turn);
      });

      this.gameUpdate();
    });
  }

  startResponseScreen(turn) {
    return new Promise((resolve, reject) => {
      this.setState({
        type: gameStates.RESPONSE_SCREEN,
        turn: turn.toPrivateResource(),
        round: this.getCurrentRound().toClientResource(),
      });

      let counter = this.responseTime;

      this.gameUpdate();

      this.counterInterval = setInterval(() => {
        counter--;

        if (counter <= 0) {
          clearInterval(this.counterInterval);
          resolve(turn);
        }
      }, 1000);
    });
  }

  start() {
    if (this.players.length < 2) {
      return;
    }

    for (let i = 1; i <= this.roundCount; i++) {
      const round = new Round(this.players, i);
      this.rounds.push(round);
    }

    const turn = this.getCurrentTurn();

    if (turn) {
      this.startTurn(turn);
    }
  }

  promote(player) {
    if (this.findPlayerById(player.id)) {
      this.leaderId = player.id;
      this.gameUpdate();
      this.log(`${player.nickname} has been promoted as leader`);
    }
  }

  toClientResource() {
    return {
      id: this.id,
      state: this.state,
      leaderId: this.leaderId,
      players: this.players.map((p) => p.toClientResource()),
      scores: this.scores,
      roundCount: this.roundCount,
    };
  }

  shouldBroadcast(player) {
    if (this.state && this.state.type == gameStates.WAITING_PLAYERS) {
      return true;
    }

    if (
      this.state &&
      this.state.type == gameStates.PLAY_SONG &&
      player.id === this.state.turn.playerId
    ) {
      return true;
    }

    return false;
  }

  pressKey(key, player) {
    if (this.shouldBroadcast(player)) {
      key.color = player && player.color ? player.color : null;
      player.socket.broadcast.to(this.id).emit(events.KEY_PRESSED, key);
    }
  }

  unpressKey(key, player) {
    if (this.shouldBroadcast(player)) {
      player.socket.broadcast.to(this.id).emit(events.KEY_RELEASED, key);
    }
  }

  givePoints(player, points) {
    if (this.scores[player.id]) {
      this.scores[player.id] += points;
    } else {
      this.scores[player.id] = points;
    }
  }

  log(content, player, color) {
    const message = new LogMessage(content, color);

    if (player) {
      this.emitToPlayer(player, events.LOG, message.toClientResource());
    } else {
      this.emit(events.LOG, message.toClientResource());
    }
  }

  checkFullGuessed() {
    const turn = this.getCurrentTurn();

    if (turn) {
      const results = this.players
        .filter((p) => p.id !== turn.player.id)
        .map((p) => {
          return turn.songWins[p.id] && turn.artistWins[p.id];
        });

      console.log(results);

      if (results.every((v) => v === true)) {
        return true;
      }
    }

    return false;
  }

  chatMessage(player, message) {
    const chatMessage = new ChatMessage(player, message);

    if (this.state.type === gameStates.PLAY_SONG) {
      const turn = this.getCurrentTurn();

      if (turn.player.id === player.id) {
        this.log(
          "You are not allowed to talk when it's your turn",
          player,
          "red"
        );
        return;
      }

      const artistName = turn.getArtistName();
      const songName = turn.getSongName();

      const artistMatch = stringSimilarity.compareTwoStrings(
        message.toLowerCase(),
        artistName.toLowerCase()
      );
      const songMatch = stringSimilarity.compareTwoStrings(
        message.toLowerCase(),
        songName.toLowerCase()
      );

      let guessed = false;

      if (songMatch >= this.guessSimilarityThreshold) {
        if (!turn.artistWins[player.id]) {
          turn.artistWins[player.id] = true;

          this.log(
            `${player.nickname} has guessed the song name and earn +${this.guessSongPoints} points! (and +${this.someoneGuessMyPlayPoints} points for ${turn.player.nickname})`,
            null,
            "green"
          );

          this.givePoints(player, this.guessSongPoints);
          this.givePoints(turn.player, this.someoneGuessMyPlayPoints);

          this.emit(events.PLAY_SFX, "success");

          guessed = true;
        }
      }

      if (artistMatch >= this.guessSimilarityThreshold) {
        if (!turn.songWins[player.id]) {
          turn.songWins[player.id] = true;
          this.log(
            `${player.nickname} has guessed the artist name and earn +${this.guessArtistPoints} points! (and +${this.someoneGuessMyPlayPoints} points for ${turn.player.nickname})`,
            null,
            "green"
          );

          this.givePoints(player, this.guessArtistPoints);
          this.givePoints(turn.player, this.someoneGuessMyPlayPoints);

          this.emit(events.PLAY_SFX, "success");

          guessed = true;
        }
      }

      if (guessed) {
        if (this.checkFullGuessed()) {
          clearInterval(this.counterInterval);
          const currenTurn = this.getCurrentTurn();
          this.startResponseScreen
            .bind(this)(currenTurn)
            .then(this.finishTurn.bind(this));
        }

        this.gameUpdate();
      } else {
        this.emit(events.CHAT_MESSAGE, chatMessage.toClientResource());
      }
    } else {
      this.emit(events.CHAT_MESSAGE, chatMessage.toClientResource());
    }
  }
}

module.exports = Game;
