require("dotenv").config();
const listEndpoints = require("express-list-endpoints");
const { start, app } = require("./modules/server.js");
const apiControllers = [require("./api/games"), require("./api/config")];
const socketController = require("./socket/socket-controller.js");
const express = require("express");
var serveIndex = require("serve-index");
const songPicker = require("./modules/song-picker");

for (let i = 0; i < apiControllers.length; i++) {
  const controller = apiControllers[i];
  app.use("/api", controller);
}

app.use("/samples", express.static(__dirname + "/samples"));
app.use("/samples", serveIndex(__dirname + "/samples"));

start()
  .then((app) => {
    console.log(listEndpoints(app));

    socketController.start();

    songPicker.start();
  })
  .catch(console.log);
