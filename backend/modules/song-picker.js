const _ = require("lodash");
const Song = require("../database/models/Song");
const sequelize = require("../database/db");
const { Sequelize } = require("sequelize");

module.exports = {
  start() {},

  getRandomSongs(limit = 1, excludedSongs = []) {
    return Song.findAll({
      order: sequelize.random(),
      limit,
      where: {
        id: {
          [Sequelize.Op.notIn]: excludedSongs,
        },
      },
    });
  },
};
