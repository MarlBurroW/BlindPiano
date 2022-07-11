const express = require("express");

const { loadNuxt, build } = require("nuxt");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const port = process.env.PORT;
const isDev = process.env.NODE_ENV !== "production";

async function start() {
  const nuxt = await loadNuxt(isDev ? "dev" : "start");

  app.use(nuxt.render);

  if (isDev) {
    build(nuxt);
  }

  server.listen(port, "0.0.0.0");

  console.log(`App listening on port ${port}`);

  return app;
}

module.exports.io = io;
module.exports.server = server;
module.exports.app = app;
module.exports.start = start;
