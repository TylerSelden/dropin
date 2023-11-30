var socket, username, password;

// todo:
// edit onmessage
// handle adminInit

function initSocket() {
  // socket = new WebSocket("wss://server.benti.dev:8443");
  socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.type == "error") {
      socket.close();
      error(msg.message);
      setTimeout(() => { window.location.reload() }, 5000);
    }

    console.log(msg);

    if (msg.type !== "adminMessage") return;
    var panelContainer = document.getElementById("panel-container");
    if (msg.message.length > 0) panelContainer.innerHTML = "";


    for (var room of msg.message) {
      panelContainer.innerHTML += `<div class="room-card">
      <h2>${room.name}</h2>
      <p><strong>Messages:</strong> ${room.messages}</p>
      <p><strong>Last modified:</strong> ${new Date(room.lastTime).toLocaleString()}</p>
      <div class="button-container">
        <button onclick="window.location.href = '../index.html?roomcode=${room.name}'">Join</button>
        <button onclick="sendDelete('${room.name}')">Delete</button>
      </div>
    </div>`;
    }
  }

  socket.onopen = function() {
    socket.send(JSON.stringify({type: "adminInit", username: username, password: password}));
  }

  socket.onclose = function() {
    error("Connection closed.");
    setTimeout(() => { window.location.reload() }, 5000);
  }

  socket.onerror = function() {
    socket.close();
    error("An error occurred.");
    setTimeout(() => { window.location.reload() }, 5000);
  }
}

function sendDelete(roomcode) {
  if (!confirm("Are you sure you want to delete this room?")) return;
  socket.send(JSON.stringify({
    type: "adminCommand",
    msg: {
      command: "delete",
      argument: roomcode
    },
    username: username,
    password: password
  }));
}

function sendMessage(msg) {
  // ensure message isn't too long
  var msg = {
    type: "adminCommand",
    msg: msg,
    username: username,
    password: password
  };
  socket.send(JSON.stringify(msg));
  // enter key delay
  setTimeout(() => {
    document.getElementById("message-input").value = "";
    document.getElementById("message-input").focus();
  }, 10);
}
