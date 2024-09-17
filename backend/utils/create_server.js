const fs = require("fs");
const http = require("http");
const https = require("https");
const WebSocketServer = require("websocket").server;

const config = require("../secrets/config.json");

if (config.https) var options = { cert: fs.readFileSync(config.cert), key: fs.readFileSync(config.key) };
const httpServer = (config.https) ? https.createServer(options) : http.createServer();

const server = new WebSocketServer({
  httpServer: httpServer
});

module.exports = { server, httpServer };
