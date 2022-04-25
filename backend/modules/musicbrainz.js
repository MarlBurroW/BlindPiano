const MusicBrainzApi = require("musicbrainz-api").MusicBrainzApi;

const mbApi = new MusicBrainzApi({
  appName: "blindpiano",
  appVersion: "0.1.0",
  appContactInfo: process.env.APP_URL,
});

module.exports = {
  getClient() {
    return mbApi;
  },
};
