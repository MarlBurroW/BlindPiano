const { body, validationResult } = require("express-validator");

const app = require("../modules/app");
const express = require("express");
const router = express.Router();

router.post(
  "/games",
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

    const player = app.playerManager.createPlayer(username);

    game.addPlayer(player);

    res.send({
      claimToken: player.claimToken,
      gameId: game.id,
    });
  }
);

module.exports = router;
