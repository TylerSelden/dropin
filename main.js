var useHTTPS = false;

// modules
var https = require('https');
var http = require('http');
var fs = require('fs');
const { client } = require('websocket');
var websocketModule = require('websocket').server;

// initialization
if (useHTTPS) var options = { key: fs.readFileSync('./ssl/key.pem'), cert: fs.readFileSync('./ssl/cert.pem') };

var port = 8080;
var httpServ = (useHTTPS) ? https.createServer(options) : http.createServer(options);
httpServ.listen(port);
var server = new websocketModule({httpServer: httpServ});

var clients = {};

function Client(username, roomcode, connection) {
  var client = {
    username: username,
    connection: connection,
    roomcode: roomcode
  };

  if (clients[username] == undefined) {
    clients[username] = client;
    return true;
  }
  return false;
}

// actual server programming


server.on('request', function(request) {
  var connection = request.accept(null, request.origin);
  connection.username = false;
  connection.on('message', function(msg) {
    var msg = msg.utf8Data;
    try { var data = JSON.parse(msg) } catch { return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."})) }
    
    // initial connection
    if (!connection.username) {
      try {
        //// sanitize data
        var clientMade = Client(data.username, data.roomcode, connection);
        if (!clientMade) {
          connection.send(JSON.stringify({type: "error", message: "Username already taken."}));
          return connection.close();
        }
        connection.username = data.username;

        //// something here
      } catch {
        connection.send(JSON.stringify({type: "error", message: "Invalid init data."}));
        return connection.close();
      }
    }

    //// real message handling
    console.log("Message from " + connection.username + ": " + msg);
    console.log(msg);
    connection.send("OK");
  });
  connection.on('close', function() {
    delete clients[connection.username];
  });
});

console.log("Server started on port " + port + ".");