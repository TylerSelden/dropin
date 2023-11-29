var socket;

function initSocket(username, roomCode) {
  // socket = new WebSocket("wss://server.benti.dev:8443");
  socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.type == "error") {
      socket.close();
      error(msg.message);
      setTimeout(() => { window.location.reload() }, 5000);
    }

    var chatContent = document.getElementById("chat-content");
    var atBottom = (Math.ceil(chatContent.scrollTop) >= chatContent.scrollHeight - chatContent.offsetHeight - 1);
    // safe to assume message at this point
    document.getElementById("chat-content").innerHTML += msg.message;

    // if user is already scrolled to bottom, scroll to bottom
    if (atBottom) chatContent.scrollTop = chatContent.scrollHeight;
  }

  socket.onopen = function() {
    socket.send(JSON.stringify({type: "init", username: username, roomCode: roomCode}));
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

function sendMessage() {
  // ensure message isn't too long
  var msg = {
    type: "message",
    msg: document.getElementById("message-input").value
  };
  socket.send(JSON.stringify(msg));
  // enter key delay
  setTimeout(() => {
    document.getElementById("message-input").value = "";
    document.getElementById("message-input").focus();
  }, 10);
}
