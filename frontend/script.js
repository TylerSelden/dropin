var socket;

function initSocket(username, roomcode) {
  // socket = new WebSocket("wss://server.benti.dev:8443");
  socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.type == "error") {
      alert(msg.message);
      window.location.reload();
    }

    var atBottom = (document.getElementById("chat-content").scrollTop == document.getElementById("chat-content").scrollHeight - document.getElementById("chat-content").offsetHeight) ? true : false;

    // safe to assume message at this point
    document.getElementById("chat-content").innerHTML += msg.message;

    // if user is already scrolled to bottom, scroll to bottom
    if (atBottom) document.getElementById("chat-content").scrollTop = document.getElementById("chat-content").scrollHeight;
  }

  socket.onopen = function() {
    socket.send(JSON.stringify({type: "init", username: username, roomcode: roomcode}));
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
