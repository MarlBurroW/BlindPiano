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
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient({ url: "redis://redis:6379" });
const subClient = pubClient.duplicate();

const port = process.env.PORT;
const isDev = process.env.NODE_ENV !== "production";

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
});

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
