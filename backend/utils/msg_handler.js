const config = require("../secrets/config.json");
var global = require("./global.js");
const { send, send_admin_data } = require("./misc.js");

const { createHash, randomUUID } = require("crypto");

var msg_handler = {
  "join": (conn, msg) => {
    if (!msg.name || !msg.code) return send(conn, "err", "Invalid message structure.");
    msg.name = msg.name.trim();
    msg.code = msg.code.trim();
    if (msg.name == "" || msg.code == "") return send(conn, "err", "Inputs must not be blank.");
    if (!(new RegExp(config.unameRegex)).test(msg.name)) return send(conn, "err", "Invalid username.");
    if (conn.data) return send(conn, "err", "You are already in a room.");

    if (config.reserved[msg.name.toLowerCase()]) {
      if (!msg.pass) {
        return send(conn, "authreq", "That username is reserved.");
      } else if (createHash("sha-256").update(msg.pass).digest("hex") !== config.reserved[msg.name.toLowerCase()]) {
        return send(conn, "autherr", "Invalid credentials.");
      }
    }

    if (global.activeClients[msg.code]) {
      for (var client of global.activeClients[msg.code]) {
        if (client.data.name.toLowerCase() == msg.name.toLowerCase()) return send(conn, "err", "That username is already in use in this room.");
      }
    } else {
      global.activeClients[msg.code] = [];
    }

    conn.data = {
      name: msg.name,
      code: msg.code,
      timestamp: Date.now(),
      id: randomUUID()
    }

    global.activeClients[msg.code].push(conn);

    send(conn, "msgs", global.rooms[msg.code] || []);
  },
  "msg": (conn, msg) => {
    if (!msg.msg) return send(conn, "err", "Invalid message structure.");
    if (msg.msg.trim() == "") return send(conn, "err", "Message cannot be blank.");
    if (!conn.data) return send(conn, "err", "You aren't in a room.");
    if (msg.msg.length > config.maxLen) return send(conn, "err", "Your message exceeds the maximum character limit.");

    var _msg = {
      timestamp: Date.now(),
      name: conn.data.name,
      text: msg.msg
    }

    if (!global.rooms[conn.data.code]) global.rooms[conn.data.code] = [];

    while (global.rooms[conn.data.code].length >= config.maxMessages) global.rooms[conn.data.code].shift();
    global.rooms[conn.data.code].push(_msg);

    for (var i in global.activeClients[conn.data.code]) {
      var client = global.activeClients[conn.data.code][i];
      send(client, "msg", _msg);
    }
  },
  "adminjoin": (conn, msg) => {
    if (!msg.pass) return send(conn, "err", "Invalid message structure.");
    if (createHash("sha-256").update(msg.pass).digest("hex") !== config.adminHash) return send(conn, "autherr", "Invalid credentials.");
    if (global.admin) {
      send(conn, "info", "An admin connection is currently active; It will be terminated.");
      send(global.admin, "newauth", "Another admin connection has been established, terminating this connection.");
      global.admin.close();
    }
    conn.admin = true;
    global.admin = conn;

    send_admin_data();
  },
  "admincmd": (conn, msg) => {
    if (!msg.pass || !msg.cmd) return send(conn, "err", "Invalid message structure.");
    if (createHash("sha-256").update(msg.pass).digest("hex") !== config.adminHash) return send(conn, "autherr", "Invalid credentials.");
    if (!admin_funcs[msg.cmd]) return send(conn, "err", "Unknown command.");

    admin_funcs[msg.cmd](conn, msg);
  }
}

const admin_funcs = {
  "killuser": (conn, msg) => {
    if (!msg.msg) return send(conn, "err", "A user ID must be provided.");

    var user = global.clients.find(client => client.data && client.data.id == msg.msg);
    if (!user) return send(conn, "err", "Provided user does not exist.");
    user.close();
    send(conn, "info", "User connection terminated.");
  },
  "killroom": (conn, msg) => {
    if (!msg.msg) return send(conn, "err", "A room code must be provided.");

    var room = global.rooms[msg.msg];
    if (!room) return send(conn, "err", "Provided room does not exist.");

    if (global.activeClients[msg.msg]) {
      for (var user of global.activeClients[msg.msg]) user.close();
    }
    delete global.activeClients[msg.msg];
    delete global.rooms[msg.msg];
    send(conn, "info", "Room successfully deleted.");
  }
}

module.exports = msg_handler;
