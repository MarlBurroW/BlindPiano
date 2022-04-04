require("dotenv").config();
const listEndpoints = require("express-list-endpoints");
const { start, app } = require("./modules/server.js");
const apiControllers = [require("./api/games"), require("./api/config")];
const socketController = require("./socket/socket-controller.js");

for (let i = 0; i < apiControllers.length; i++) {
  const controller = apiControllers[i];
  app.use("/api", controller);
}

start()
  .then((app) => {
    console.log(listEndpoints(app));

    socketController.start();
  })
  .catch(console.log);
