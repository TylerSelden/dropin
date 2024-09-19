var global = require("./global.js");
const { send } = require("./misc.js");

var msg_handler = {
  "join": (conn, msg) => {
    if (!msg.name || !msg.code) return send(conn, "err", "Invalid message structure.");
    if (msg.name.trim() == "" || msg.code.trim() == "") return send(conn, "err", "Inputs must not be blank.");
    if (conn.data) return send(conn, "err", "You are already in a room.");

    if (global.activeClients[msg.code]) {
      for (var client of global.activeClients[msg.code]) {
        if (client.name == msg.name) return send(conn, "err", "That username is already in use in this room.");
      }
    } else {
      global.activeClients[msg.code] = [];
    }

    conn.data = {
      name: msg.name,
      code: msg.code
    }

    global.activeClients[msg.code].push(conn);

    send(conn, "msgs", global.rooms[msg.code] || []);
  },
  "msg": (conn, msg) => {
    if (!msg.msg) return send(conn, "err", "Invalid message structure.");
    if (msg.msg.trim() == "") return send(conn, "err", "Message cannot be blank.");
    if (!conn.data) return send(conn, "err", "You aren't in a room.");

    if (!global.rooms[conn.data.code]) global.rooms[conn.data.code] = [];
    global.rooms[conn.data.code].push(msg.msg);
    for (var i in global.activeClients[conn.data.code]) {
      var client = global.activeClients[conn.data.code][i];
      send(client, "msg", msg.msg);
    }
  }
}

module.exports = msg_handler;
