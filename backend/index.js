var global = require("./utils/global.js");
const config = require("./secrets/config.json");

const fs = require("fs");
const { server, httpServer } = require("./utils/create_server.js");
const server_main = require("./utils/server_main.js");
const { send } = require("./utils/misc.js");
require("./utils/events.js");

server.on("request", server_main);


httpServer.listen(config.port);

global.started = Date.now();

console.log(`Server started on port ${config.port} at ${new Date(global.started).toLocaleString()}. It will autosave every ${config.saveInterval} seconds.

Error log: ${config.errFile}`);
