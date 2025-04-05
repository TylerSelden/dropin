var global = require("./global.js");
const { send, remove_from_arr } = require("./misc.js");
const msg_handler = require("./msg_handler.js");

function handle_msg(conn, msg) {
  try {
    msg = JSON.parse(msg);
  } catch {
    return send(conn, "err", "Invalid JSON.");
  }

  if (msg_handler[msg.type]) {
    try {
      return msg_handler[msg.type](conn, msg);
    } catch (err) {
      console.error(err);
      return send(conn, "err", "Something went wrong.");
    }
  }
  send(conn, "err", "Invalid message type.");
}





function server_main(req) {
  var conn = req.accept(null, req.origin);
  global.clients.push(conn);

  conn.on("message", (msg) => {
    msg = msg.utf8Data;

    try {
      handle_msg(conn, msg);
    } catch (err) {
      global.err(err);
      send(conn, "err", "Something went wrong.");
    }
  });

  conn.on("close", () => {
    if (conn == global.admin) global.admin = null;
    if (conn.data) remove_from_arr(global.activeClients[conn.data.code], conn);
    remove_from_arr(global.clients, conn);
  })
}

module.exports = server_main;
