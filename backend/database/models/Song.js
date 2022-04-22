const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../db");

class Song extends Model {}

Song.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    artist: {
      type: DataTypes.STRING,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
    },
    length_seconds: {
      type: DataTypes.INTEGER,
    },
    likes_count: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: "Song", // We need to choose the model name
  }
);

Song.sync();

module.exports = Song;
