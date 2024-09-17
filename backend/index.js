const config = require("./secrets/config.json");

const { server, httpServer } = require("./utils/create_server.js");
const server_main = require("./utils/server_main.js");

server.on("request", server_main);

httpServer.listen(config.port);
