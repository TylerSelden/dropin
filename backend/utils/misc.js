const global = require("./global.js");

function send(conn, type, msg) {
  conn.send(JSON.stringify({ type, msg }));
}

function remove_from_arr(arr, item) {
  if (!arr) return null;

  const index = arr.indexOf(item);
  if (index > -1) return arr.splice(index, 1);
  return null;
}

function send_admin_data() {
  if (!global.admin) return;

  const _clients = global.clients.map(obj => obj.data);
  const _rooms = Object.keys(global.rooms).map(code => ({ code, lastmsg: global.rooms[code].slice(-1)[0], msgnum: global.rooms[code].length }));
  _rooms.sort((a, b) => { return b.lastmsg.timestamp - a.lastmsg.timestamp });

  send(global.admin, "adminmsg", {
    clients: _clients,
    rooms: _rooms,
    stats: global.stats
  });
}

module.exports = { send, remove_from_arr, send_admin_data }
