function send(conn, type, msg) {
  conn.send(JSON.stringify({ type, msg }));
}

function remove_from_arr(arr, item) {
  if (!arr) return null;

  const index = arr.indexOf(item);
  if (index > -1) return arr.splice(index, 1);
  return null;
}

module.exports = { send, remove_from_arr }
