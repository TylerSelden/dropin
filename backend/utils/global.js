const path = require("path");
const fs = require("fs");
const config = require("../secrets/config.json");

var global = {
  clients: [],
  activeClients: {},
  rooms: {},
  stats: {
    msgs: 10934,
    connections: 9823,
    rooms: 232
  },
  saveVer: 0,
  admin: null
}

var data = require(path.join("../", config.saveFile));



var updateSave = [
  null,
  // 1, convert rooms to new data format, allowing for additional save values
  () => {
    data = {
      rooms: data,
      stats: global.stats,
      saveVer: 1
    }
    console.log(data);
  }
]

const errStream = fs.createWriteStream(config.errFile, { flags: "a" });
global.err = (err) => {
  console.error(err);
  errStream.write(`\n\n${new Date().toLocaleString()}: ${err.stack}`);
}

// update save versions
if (data.saveVer) global.saveVer = data.saveVer;
while (global.saveVer < config.saveVer) {
  console.log(`Upgrading save version from ${global.saveVer} to ${global.saveVer + 1}.`);
  global.saveVer++;
  updateSave[global.saveVer]();
}


global.rooms = data.rooms;
global.stats = data.stats;


module.exports = global;
