var SpotifyWebApi = require("spotify-web-api-node");
const _ = require("lodash");
var spotifyApi = new SpotifyWebApi({
  clientId: "a146bf9a73aa4bf3882df9db85a02f2d",
  clientSecret: "4f79f3beaa8d463f8f2121638c970c1b",
  redirectUri: "https://blindpiano.marlburrow.fr/callback",
});

var Spotify = require("spotify-web-api-js");

let playlist = [];
module.exports = {
  start() {
    spotifyApi.clientCredentialsGrant().then((data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);

      spotifyApi.getPlaylist(process.env.SPOTIFY_PLAYLIST_ID).then((data) => {
        playlist = data.body.tracks.items.map((item) => item.track);
      });

      console.log("Song picker started");
    });
  },

  getRandomSongExcluding(excludedSongs) {
    let pickedSong = _.sample(
      playlist.filter((s) => !excludedSongs.includes(s.id))
    );

    if (!pickedSong) {
      pickedSong = _.sample(playlist);
    }

    return pickedSong;
  },
};
