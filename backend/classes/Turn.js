const _ = require("lodash");

class Turn {
  constructor(player) {
    this.player = player;
    this.song = null;
    this.finished = false;
    this.artistWins = {};
    this.songWins = {};
  }

  finish() {
    this.finished = true;
  }

  getPlayer() {
    return this.player;
  }

  setSong(song) {
    this.song = song;
  }

  getSong(song) {
    return this.song;
  }

  getSongName() {
    return this.song.name.split("-")[0];
  }

  getArtistName() {
    return this.song.artists[0].name;
  }

  toClientResource() {
    return {
      playerId: this.player.id,
    };
  }
  toPrivateResource() {
    return {
      playerId: this.player.id,
      song: this.song,
      songWins: this.songWins,
      artistWins: this.artistWins,
    };
  }
}

module.exports = Turn;
