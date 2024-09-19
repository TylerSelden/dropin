var global = require("./utils/global.js");
const config = require("./secrets/config.json");

const fs = require("fs");
const { server, httpServer } = require("./utils/create_server.js");
const server_main = require("./utils/server_main.js");
const { send } = require("./utils/misc.js");

server.on("request", server_main);


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

httpServer.listen(config.port);
