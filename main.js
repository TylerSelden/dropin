// additional settings: settings.json

// default settings
var useHTTPS = true;
var backupInterval = 5; // minutes
var restore = false; // restore messages from backup.json
var maxMessages = 500; // max messages to store per room
var roomDeleteInterval = 7; // days
var rateLimitInterval = 5; // seconds
var rateLimitMax = 10; // messages
var maxRooms = 50; // max rooms to have at one time
var adminUsername = "admin";
var adminPassword = "password"; // CHANGE THIS ON RUN
var backupFile = "./backup.json";


// modules
var https = require('https');
var http = require('http');
var fs = require('fs');
var websocketModule = require('websocket').server;

// initialization

// read settings from settings.json
var settings = fs.readFileSync('./settings.json');
try {
  settings = JSON.parse(settings);
  for (var i in settings) {
    eval(`${i} = settings[i]`);
  }
} catch {
  console.log("Invalid settings.json file. Using default settings.");
}

// configure HTTPS
if (useHTTPS) var options = { key: fs.readFileSync('../ssl/key.pem'), cert: fs.readFileSync('../ssl/cert.pem') };

// create server
var port = (useHTTPS) ? 8443 : 8080;
var httpServ = (useHTTPS) ? https.createServer(options) : http.createServer(options);
httpServ.listen(port);
var server = new websocketModule({httpServer: httpServ});

// more declarations
var clients = {};
var messages = {};
var lastRoomTimes = {};

// restore messages from backup.json
if (restore) {
  fs.readFile(backupFile, function(err, data) {
    if (err) console.log(err);
    data = JSON.parse(data);
    messages = data[0];
    lastRoomTimes = data[1];
  });
}

function Client(username, roomCode, connection) {
  var client = {
    username: username,
    connection: connection,
    roomCode: roomCode
  };

  if (clients[username] == undefined) {
    clients[username] = client;
    return true;
  }
  return false;
}



// ================================================================
// ================================================================


// actual server programming

server.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  connection.username = false;
  connection.lastMsgTimes = [];

  connection.on('message', function(msg) {
    var msg = msg.utf8Data;
    try { var data = JSON.parse(msg); } catch { return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."})) }
    if (data.type == undefined) return connection.send(JSON.stringify({type: "error", message: "Invalid JSON struct."}));

    if (data.type == "adminCommand") {
      return adminCommand(data, connection);
    }

    // initial connection
    if (!connection.username) {
      if (data.type == "adminInit") {
        return adminInit(data, connection);
      }
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

console.log(`Server started on port ${port}.\n\nAdmin username: "${adminUsername}"\nAdmin password: "${"*".repeat(adminPassword.length)}"`);





// ================================================================
// ================================================================


// various utility functions


// check rate limits

function rateLimit(data, connection) {
  // time-based rate limits
  if (connection.lastMsgTimes.length >= rateLimitMax) connection.lastMsgTimes.shift();
  connection.lastMsgTimes.push(Date.now());
  // check if lastMsgTimes[0] was less than 5 seconds ago
  if (connection.lastMsgTimes[rateLimitMax - 1] !== undefined && connection.lastMsgTimes[0] >= connection.lastMsgTimes[rateLimitMax - 1] - rateLimitInterval * 1000) {
    return connection.send(JSON.stringify({type: "error", message: "Rate limit exceeded."}));
  }

  // check for empty data
  if (data.msg.trim() == "") return -1;

  // check if message is too long
  if (data.msg.length > 1024) {
    connection.send(JSON.stringify({type: "error", message: "Max message length exceeded."}));
    connection.close();
    return -1;
  }
  return 0;
}


// send message to all clients in the same room

function sendMessage(msg, connection) {
  try {
    var from = connection.username;
    // send to clients with same room code
    for (var i in clients) {
      var client = clients[i];
      if (client.roomCode == clients[from].roomCode) {
        client.connection.send(JSON.stringify({type: "message", username: from, message: `<p>${from}: ${msg}</p>`}));
      }
    };

    if (messages[clients[from].roomCode] == undefined) messages[clients[from].roomCode] = [];
    messages[clients[from].roomCode].push({username: from, message: `<p>${from}: ${msg}</p>`});
    lastRoomTimes[clients[from].roomCode] = Date.now();

    // remove old messages
    if (messages[clients[from].roomCode].length >= maxMessages) {
      messages[clients[from].roomCode].splice(0, messages[clients[from].roomCode].length - maxMessages);
    }

    // check if rooms need to be deleted
    checkMaxRooms();
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid message."}));
  }
}

// check maximum rooms
function checkMaxRooms() {
  if (Object.keys(lastRoomTimes).length > maxRooms) {
    // remove oldest rooms (based on value of each) until there are only maxRooms left
    var rooms = Object.keys(lastRoomTimes);
    rooms.sort(function(a, b) { return lastRoomTimes[a] - lastRoomTimes[b] });
    while (rooms.length > maxRooms) {
      delete messages[rooms[0]];
      delete lastRoomTimes[rooms[0]];
      rooms.shift();
    }
  }
}

// handle client's inital connection
function initConnect(data, connection) {
  try {
    if (data.username == "" || data.roomCode == "") {
      connection.send(JSON.stringify({type: "error", message: "Field cannot be empty."}));
      connection.close();
    }
    var clientMade = Client(data.username, data.roomCode, connection);
    if (!clientMade) {
      connection.send(JSON.stringify({type: "error", message: "Username already taken."}));
      return connection.close();
    }
    connection.username = data.username;
    connection.send(JSON.stringify({type: "message", message: `Joined room: "${data.roomCode}"`}));
    // sendMessage(`joined the chat.`, connection);

    if (messages[data.roomCode] == undefined) return;
    lastRoomTimes[data.roomCode] = Date.now();
    for (var i in messages[data.roomCode]) {
      var message = messages[data.roomCode][i];
      connection.send(JSON.stringify({type: "message", username: message.username, message: message.message}));
    }
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid init data."}));
    return connection.close();
  }
}

// authenticate admin
function adminAuth(data, connection) {
  if (data.username !== adminUsername || data.password !== adminPassword) {
    connection.send(JSON.stringify({type: "error", message: "Invalid credentials."}));
    return false;
  }
  return true;
}

// initialize admin connection & send room listing
function adminInit(data, connection) {
  // authenticate
  if (!adminAuth(data, connection)) return;
  
  // get rooms listing
  var roomListing = getRoomListing();

  // sort rooms by lastTime, then by messages
  roomListing.sort(function(a, b) {
    if (a.lastTime == b.lastTime) return b.messages - a.messages;
    return b.lastTime - a.lastTime;
  });
  var msg = {
    type: "adminMessage",
    message: roomListing
  }
  connection.send(JSON.stringify(msg));
}

function getRoomListing() {
  var roomListing = [];
  for (var i in lastRoomTimes) roomListing.push({ name: i, messages: messages[i].length, lastTime: lastRoomTimes[i] });
  return roomListing;
}

// admin commands :D
var adminCommands = {
  "delete": function(argument) {
    delete messages[argument];
    delete lastRoomTimes[argument];
  },
  "sendGlobal": function(argument) {
    // send message to every existing room
    var roomListing = getRoomListing();
    for (var i in roomListing) {
      var room = roomListing[i];
      for (var j in clients) {
        if (clients[j].roomCode == room.name) {
          clients[j].connection.send(JSON.stringify({type: "message", message: `<p>Admin: ${argument}</p>`}));
        }
      }
      if (messages[room.name] == undefined) messages[room.name] = [];
      messages[room.name].push({username: "Admin", message: `<p>${argument}</p>`});
      lastRoomTimes[room.name] = Date.now();
    }
  }
}

// run admin command
// admin command format: {type: "adminCommand", msg: {command: "delete", argument: "roomcode"}, username: "admin", password: "password"}
function adminCommand(data, connection) {
  // authenticate
  if (!adminAuth(data, connection)) return;

  try {
    adminCommands[data.msg.command](data.msg.argument);
    adminInit(data, connection); // update listing
  } catch {
    connection.send(JSON.stringify({type: "error", message: "Invalid command."}));
  }
}

// Every backupInterval minutes, back up all messages to backup.json
setInterval(function() {
  // back up messages
  var backupData = [
    messages,
    lastRoomTimes
  ];
  fs.writeFile(backupFile, JSON.stringify(backupData), function(err) {
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
