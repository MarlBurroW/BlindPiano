const { body, checkSchema, validationResult } = require("express-validator");

const app = require("../modules/app");
const express = require("express");
const router = express.Router();
const youtube = require("../modules/youtube");
const audiodb = require("../modules/audiodb");

const Song = require("../database/models/Song");

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

router.get("/songs/search_audiodb_artist", async (req, res, next) => {
  const client = audiodb.getClient();

  client
    .searchArtist(req.query.search)
    .then((results) => {
      res.send(results);
    })
    .catch(next);
});

router.get("/songs/search_audiodb_song", async (req, res, next) => {
  const client = audiodb.getClient();

  client
    .searchSong(req.query.artistSearch, req.query.songSearch)
    .then((results) => {
      res.send(results);
    })
    .catch(next);
});

router.get("/songs/search_youtube", async (req, res, next) => {
  const client = await youtube.getClient();

  client
    .search(req.query.search)
    .then((results) => {
      res.send(results);
    })
    .catch(next);
});

router.get("/songs", (req, res) => {
  Song.findAll().then((songs) => {
    res.send(songs);
  });
});

router.delete("/songs/:songId", (req, res, next) => {
  Song.destroy({
    where: {
      id: req.params.songId,
    },
  }).then(function () {
    res.status(200).send();
  });
});

router.post("/songs/info", body("youtube_id").trim(), async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const client = await youtube.getClient();

  try {
    const song = await client.getDetails(req.body.youtube_id);
    res.send(song);
  } catch (err) {
    res
      .status(400)
      .json({ message: `Error while scrapping Youtube: ${err.message}` });
  }
});

router.post(
  "/songs",
  checkSchema({
    id: {
      isLength: {
        min: 1,
        max: 32,
      },
    },
    title: {
      isLength: {
        min: 1,
        max: 32,
      },
    },
    artist: {
      isLength: {
        min: 1,
        max: 32,
      },
    },
    thumbnail_url: {
      isURL: true,
    },

    length_seconds: {
      isInt: true,
    },
    likes_count: {
      isInt: true,
    },
  }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    try {
      const song = await Song.create(req.body);
    } catch (err) {
      res.status(400).send({ message: err.errors[0].message });
    }

    res.send([]);
  }
);

module.exports = router;
