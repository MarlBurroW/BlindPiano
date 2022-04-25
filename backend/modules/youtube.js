const Innertube = require("youtubei.js");

let youtube = null;

module.exports = {
  getClient() {
    return new Promise((resolve) => {
      if (youtube) {
        resolve(youtube);
      } else {
        new Innertube({ gl: "FR" }).then((yt) => {
          youtube = yt;
          resolve(yt);
        });
      }
    });
  },
};
