const axios = require("axios");

module.exports = {
  getClient() {
    return {
      searchArtist(search) {
        return axios
          .get(
            `https://theaudiodb.com/api/v1/json/${process.env.AUDIODB_APIKEY}/search.php?s=${search}`
          )
          .then((res) => {
            return res.data.artists;
          });
      },
      searchSong(artistSearch, songSearch) {
        console.log(
          `https://theaudiodb.com/api/v1/json/${process.env.AUDIODB_APIKEY}/searchtrack.php?s=${artistSearch}&t=${songSearch}`
        );
        return axios
          .get(
            `https://theaudiodb.com/api/v1/json/${process.env.AUDIODB_APIKEY}/searchtrack.php?s=${artistSearch}&t=${songSearch}`
          )
          .then((res) => {
            return res.data.tracks;
          });
      },
    };
  },
};
