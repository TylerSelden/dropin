const path = require("path");
const config = require("../secrets/config.json");

var global = {
  clients: [],
  activeClients: {},
  rooms: {}
}

global.rooms = require(path.join("../", config.saveFile));

module.exports = global;
