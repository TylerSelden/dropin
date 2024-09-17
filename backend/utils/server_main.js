function server_main(req) {
  var connection = req.accept(null, req.origin);

  connection.on("message", (msg) => {
    msg = msg.utf8Data;
    connection.send(msg);
  });
}

module.exports = server_main;
