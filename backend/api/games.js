const { body, checkSchema, validationResult } = require("express-validator");

const app = require("../modules/app");
const express = require("express");
const router = express.Router();

router.get("/games", (req, res) => {
  res.send(
    app.gameManager.games.map((g) => {
      return {
        id: g.id,
        state: g.state.type,
        player_count: g.players.length,
        spectator_count: g.spectators.length,
        persons: g.persons.map((p) => {
          return {
            nickname: p.nickname,
            socketId: p.socket ? p.socket.id : null,
          };
        }),
      };
    })
  );
});

router.post(
  "/games",
  checkSchema({
    "avatar.backgroundType": {
      isIn: {
        options: [["transparent", "circle"]],
      },
    },
    "avatar.skinColor": {
      isIn: {
        options: [
          ["tanned", "yellow", "pale", "light", "brown", "darkBrown", "dark"],
        ],
      },
    },
    "avatar.eyebrowType": {
      isIn: {
        options: [
          [
            "angry",
            "angryNatural",
            "default",
            "defaultNatural",
            "flatNatural",
            "frownNatural",
            "raisedExcited",
            "raisedExcitedNatural",
            "sadConcerned",
            "sadConcernedNatural",
            "unibrowNatural",
            "updown",
            "updownNatural",
          ],
        ],
      },
    },
    "avatar.eyesType": {
      isIn: {
        options: [
          [
            "close",
            "cry",
            "default",
            "dizzy",
            "eyeroll",
            "happy",
            "hearts",
            "side",
            "squint",
            "surprised",
            "wink",
            "winkWacky",
          ],
        ],
      },
    },
    "avatar.mouthType": {
      isIn: {
        options: [
          [
            "concerned",
            "default",
            "disbelief",
            "eating",
            "grimace",
            "sad",
            "screamOpen",
            "serious",
            "smile",
            "tongue",
            "twinkle",
            "vomit",
          ],
        ],
      },
    },
    "avatar.facialHairType": {
      isIn: {
        options: [
          [
            "none",
            "beardMedium",
            "beardLight",
            "beardMajestic",
            "moustacheFancy",
            "moustacheMagnum",
          ],
        ],
      },
    },

    "avatar.facialHairColor": {
      isIn: {
        options: [
          [
            "auburn",
            "black",
            "blonde",
            "blondeGolden",
            "brown",
            "brownDark",
            "platinum",
            "red",
          ],
        ],
      },
    },
    "avatar.accessoriesType": {
      isIn: {
        options: [
          [
            "none",
            "eyepatch",
            "kurt",
            "prescription01",
            "prescription02",
            "round",
          ],
        ],
      },
    },
    "avatar.topType": {
      isIn: {
        options: [
          [
            "none",
            "hat",
            "hijab",
            "turban",
            "winterHat1",
            "winterHat2",
            "winterHat3",
            "winterHat4",
            "longHairBigHair",
            "longHairBob",
            "longHairBun",
            "longHairCurly",
            "longHairCurvy",
            "longHairDreads",
            "longHairFro",
            "longHairFroBand",
            "longHairNotTooLong",
            "longHairShavedSides",
            "longHairMiaWallace",
            "longHairStraight",
            "longHairStraight2",
            "longHairStraightStrand",
            "shortHairDreads01",
            "shortHairDreads02",
            "shortHairFrizzle",
            "shortHairShaggyMullet",
            "shortHairShortCurly",
            "shortHairShortFlat",
            "shortHairShortRound",
            "shortHairShortWaved",
            "shortHairSides",
            "shortHairTheCaesar",
            "shortHairTheCaesarSidePart",
          ],
        ],
      },
    },
    "avatar.topColor": {
      isIn: {
        options: [
          [
            "auburn",
            "black",
            "blonde",
            "blondeGolden",
            "brown",
            "brownDark",
            "platinum",
            "red",
            "blue01",
            "blue02",
            "blue03",
            "gray01",
            "gray02",
            "heather",
            "pastelBlue",
            "pastelGreen",
            "pastelOrange",
            "pastelRed",
            "pastelYellow",
            "pink",
            "red01",
            "white",
          ],
        ],
      },
    },

    "avatar.clothesType": {
      isIn: {
        options: [
          [
            "blazerShirt",
            "blazerSweater",
            "collarSweater",
            "graphicShirt",
            "hoodie",
            "overall",
            "shirtCrewNeck",
            "shirtScoopNeck",
            "shirtVNeck",
          ],
        ],
      },
    },

    "avatar.clothesColor": {
      isIn: {
        options: [
          [
            "black",
            "blue01",
            "blue02",
            "blue03",
            "gray01",
            "gray02",
            "heather",
            "pastelBlue",
            "pastelGreen",
            "pastelOrange",
            "pastelRed",
            "pastelYellow",
            "pink",
            "red",
            "white",
          ],
        ],
      },
    },
    "avatar.clothesGraphicsType": {
      isIn: {
        options: [
          [
            "none",
            "bat",
            "cumbia",
            "diamond",
            "pizza",
            "resist",
            "selena",
            "bear",
            "skullOutline",
            "skull",
          ],
        ],
      },
    },
  }),
  body("nickname")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars long")
    .isAlpha()
    .withMessage("must be an alphanumeric string")
    .trim()
    .escape(),

  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    const username = req.body.nickname;
    let game = null;

    if (req.body.gameId) {
      game = app.gameManager.findGameById(req.body.gameId);

      if (!game) {
        return res.status(400).json({ message: "Game not found" });
      }
    } else {
      game = app.gameManager.createGame();
      app.gameManager.addGame(game);
    }

    const person = app.personManager.createPerson(username, req.body.avatar);

    game.addPerson(person);

    res.send({
      claimToken: person.claimToken,
      gameId: game.id,
    });
  }
);

module.exports = router;
