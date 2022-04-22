const { body, checkSchema, validationResult } = require("express-validator");

const app = require("../modules/app");
const express = require("express");
const router = express.Router();

const Innertube = require("youtubei.js");

const Song = require("../database/models/Song");

function youtube_parser(url) {
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : false;
}

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

router.post(
  "/songs/info",
  body("youtube_url").isURL().withMessage("must be an URL").trim(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const video_id = youtube_parser(req.body.youtube_url);

    try {
      const youtube = await new Innertube({ gl: "FR" }); // all parameters are optional.
      const song = await youtube.getDetails(video_id);
      res.send(song);
    } catch (err) {
      res
        .status(400)
        .json({ message: `Error while scrapping Youtube: ${err.message}` });
    }
  }
);

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
