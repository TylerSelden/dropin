var useHTTPS = false;
var backupInterval = 5; // minutes

// modules
var https = require('https');
var http = require('http');
var fs = require('fs');
var websocketModule = require('websocket').server;

// initialization
if (useHTTPS) var options = { key: fs.readFileSync('./ssl/key.pem'), cert: fs.readFileSync('./ssl/cert.pem') };

var port = 8080;
var httpServ = (useHTTPS) ? https.createServer(options) : http.createServer(options);
httpServ.listen(port);
var server = new websocketModule({httpServer: httpServ});

var clients = {};
var messages = {};

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
    try { var data = JSON.parse(msg); } catch { return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."})) }
    if (data.type == undefined) return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."}));

    // initial connection
    if (!connection.username) {
      return initConnect(data, connection);
    }

    // real message handling
    if (data.type == "message") return sendMessage(data.msg, connection);
  });
  connection.on('close', function() {
    // send left chat message
    sendMessage(`left the chat.`, connection);
    delete clients[connection.username];
  });
});

console.log("Server started on port " + port + ".");


function sendMessage(msg, connection) {
  try {
    var from = connection.username;
    // send to clients with same room code
    for (var i in clients) {
      var client = clients[i];
      if (client.roomcode == clients[from].roomcode) {
        client.connection.send(JSON.stringify({type: "message", username: from, message: `<p>${from}: ${msg}</p>`}));
      }
    };
    if (messages[clients[from].roomcode] == undefined) messages[clients[from].roomcode] = [];
    messages[clients[from].roomcode].push({username: from, message: `<p>${from}: ${msg}</p>`, date: new Date()});
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid message."}));
  }
}


function initConnect(data, connection) {
  try {
    if (data.username == "" || data.roomcode == "") {
      connection.send(JSON.stringify({type: "error", message: "Field cannot be empty."}));
      connection.close();
    }
    var clientMade = Client(data.username, data.roomcode, connection);
    if (!clientMade) {
      connection.send(JSON.stringify({type: "error", message: "Username already taken."}));
      return connection.close();
    }
    connection.username = data.username;
    sendMessage(`joined the chat.`, connection);

    if (messages[data.roomcode] == undefined) messages[data.roomcode] = [];
    for (var i in messages[data.roomcode]) {
      var message = messages[data.roomcode][i];
      connection.send(JSON.stringify({type: "message", username: message.username, message: message.message}));
    }
    //// send client prev messages!!
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid init data."}));
    return connection.close();
  }
}

// Every 5 minutes, back up all messages to backup.json
setInterval(function() {
  fs.writeFile("./backup.json", JSON.stringify(messages), function(err) {
    if (err) console.log(err);
  });
}, backupInterval * 60 * 1000);

// Every 5 minutes, delete all messages older than deleteInterval days
var deleteInterval = 7;
setInterval(function() {
  var now = new Date();
  for (var i in messages) {
    var room = messages[i];
    for (var j in room) {
      var message = room[j];
      var date = new Date(message.date);
      if (now - date > deleteInterval * 24 * 60 * 60 * 1000) {
        room.splice(j, 1);
      }
    }
  }
}, backupInterval * 60 * 1000);