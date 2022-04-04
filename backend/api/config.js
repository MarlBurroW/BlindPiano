const express = require("express");
const router = express.Router();

router.get(
  "/config",

  (req, res) => {
    res.send({
      app_url: process.env.APP_URL,
    });
  }
);

module.exports = router;
