const config = require("../secrets/config.json");
const global = require("./global.js");

const fs = require("fs");
const { send } = require("./misc.js");

process.on("SIGINT", () => {
  console.log("\nSIGINT received, disconnecting clients gracefully...");
  for (var conn of global.clients) {
    send(conn, "disc", "The server is shutting down.");
    conn.close();
  }
  console.log("\nClients disconnected, saving...");
  fs.writeFileSync(config.saveFile, JSON.stringify(global.rooms));
  console.log("Saved, exiting.");
  process.exit();
});


const errorFileStream = fs.createWriteStream(config.errFile, { flags: "a" });

process.on("uncaughtException", (err) => {
  console.error(err);
  errorFileStream.write(`\n\n${new Date().toLocaleString()}: ${err.stack}`);
});

setInterval(() => {
  // prune old rooms
  for (var i in global.rooms) {
    var room = global.rooms[i];
    var lastMsgTime = room[room.length - 1].timestamp;

    if (Date.now() - lastMsgTime > 86400000 * config.maxRoomTime) delete global.rooms[i];
  }
  fs.writeFileSync(config.saveFile, JSON.stringify(global.rooms));
}, config.saveInterval * 1000);
