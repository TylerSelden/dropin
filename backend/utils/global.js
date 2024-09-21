const path = require("path");
const config = require("../secrets/config.json");

var global = {
  clients: [],
  activeClients: {},
  rooms: {},
  admin: null
}

global.rooms = require(path.join("../", config.saveFile));

module.exports = global;
