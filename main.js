// ToDo:
// Autoscroll
// Remember username / roomcodes in localStorage
// custom error and info messages client-side
// max room number


// default settings
var useHTTPS = true;
var backupInterval = 5; // minutes
var restore = false; // restore messages from backup.json
var maxMessages = 500; // max messages to store per room
var roomDeleteInterval = 7; // days
var rateLimitInterval = 5; // seconds
var rateLimitMax = 10; // messages
var filterRegex = /^\s*$/;


// check command line arguments
process.argv.forEach(function (val, index, array) {
  if (index < 2) return;
  try {
    eval(val);
  } catch {
    console.log("Invalid command line argument: " + val);
  }
});

// modules
var https = require('https');
var http = require('http');
var fs = require('fs');
var websocketModule = require('websocket').server;

// initialization
if (useHTTPS) var options = { key: fs.readFileSync('../ssl/key.pem'), cert: fs.readFileSync('../ssl/cert.pem') };

var port = (useHTTPS) ? 8443 : 8080;
var httpServ = (useHTTPS) ? https.createServer(options) : http.createServer(options);
httpServ.listen(port);
var server = new websocketModule({httpServer: httpServ});

var clients = {};
var messages = {};
var lastRoomTimes = {};

if (restore) {
  fs.readFile("./backup.json", function(err, data) {
    if (err) console.log(err);
    messages = JSON.parse(data);
  });
}

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
  connection.lastMsgTimes = [];

  connection.on('message', function(msg) {
    var msg = msg.utf8Data;
    try { var data = JSON.parse(msg); } catch { return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."})) }
    if (data.type == undefined) return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."}));

    // initial connection
    if (!connection.username) {
      return initConnect(data, connection);
    }

    // real message handling

    if (rateLimit(data, connection) !== 0) return;

    if (data.type == "message") return sendMessage(data.msg, connection);
  });
  connection.on('close', function() {
    // sendMessage(`left the chat.`, connection);
    delete clients[connection.username];
  });
});

console.log("Server started on port " + port + ".");


function rateLimit(data, connection) {
  // time-based rate limits
  if (connection.lastMsgTimes.length >= rateLimitMax) connection.lastMsgTimes.shift();
  connection.lastMsgTimes.push(Date.now());
  // check if lastMsgTimes[0] was less than 5 seconds ago
  if (connection.lastMsgTimes[rateLimitMax - 1] !== undefined && connection.lastMsgTimes[0] >= connection.lastMsgTimes[rateLimitMax - 1] - rateLimitInterval * 1000) {
    return connection.send(JSON.stringify({type: "error", message: "Rate limit exceeded."}));
  }

  // check for empty data
  if (filterRegex.test(data.msg)) return -1;
}

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
    lastRoomTimes[clients[from].roomcode] = Date.now();

    // remove old messages
    if (messages[clients[from].roomcode].length >= maxMessages) {
      messages[clients[from].roomcode].splice(0, messages[clients[from].roomcode].length - maxMessages);
    }
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
    connection.send(JSON.stringify({type: "message", message: `Joined room: "${data.roomcode}"`}));
    // sendMessage(`joined the chat.`, connection);

    if (messages[data.roomcode] == undefined) messages[data.roomcode] = [];
    lastRoomTimes[data.roomcode] = Date.now();
    for (var i in messages[data.roomcode]) {
      var message = messages[data.roomcode][i];
      connection.send(JSON.stringify({type: "message", username: message.username, message: message.message}));
    }
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid init data."}));
    return connection.close();
  }
}

// Every 5 minutes, back up all messages to backup.json
setInterval(function() {
  // back up messages
  fs.writeFile("./backup.json", JSON.stringify(messages), function(err) {
    if (err) console.log(err);
  });

  // delete old rooms
  var now = Date.now();
  for (var i in lastRoomTimes) {
    var lastRoomTime = lastRoomTimes[i];
    if (now - lastRoomTime > roomDeleteInterval * 24 * 60 * 60 * 1000) {
      delete messages[i];
      delete lastRoomTimes[i];
    }
  }
}, backupInterval * 60 * 1000);
