const _ = require("lodash");

class Turn {
  constructor(player) {
    this.player = player;
    this.song = null;
    this.finished = false;
    this.artistWins = {};
    this.songWins = {};
    this.proposedSongs = {};
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

  setProposedSongs(songs) {
    this.proposedSongs = songs;
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
      proposedSongs: this.proposedSongs,
      songWins: this.songWins,
      artistWins: this.artistWins,
    };
  }
}

module.exports = Turn;
