const config = require("../secrets/config.json");
const global = require("./global.js");

const fs = require("fs");
const { send, send_admin_data } = require("./misc.js");

process.on("SIGINT", () => {
  console.log("\nSIGINT received, disconnecting clients gracefully...");
  for (var conn of global.clients) {
    send(conn, "disc", "The server is shutting down.");
    conn.close();
  }
  console.log("\nClients disconnected, saving...");
  fs.writeFileSync(config.saveFile, JSON.stringify({ rooms: global.rooms, stats: global.stats, saveVer: global.saveVer }));
  console.log("Saved, exiting.");
  process.exit();
});


process.on("uncaughtException", (err) => {
  global.err(err);
});

setInterval(() => {
  // prune old rooms
  for (var i in global.rooms) {
    var room = global.rooms[i];
    var lastMsgTime = room[room.length - 1].timestamp;

    if (Date.now() - lastMsgTime > 86400000 * config.maxRoomTime) delete global.rooms[i];
  }
  fs.writeFileSync(config.saveFile, JSON.stringify({ rooms: global.rooms, stats: global.stats, saveVer: global.saveVer }));
}, config.saveInterval * 1000);

setInterval(send_admin_data, 1000);
