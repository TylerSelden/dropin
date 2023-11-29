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
    alert("Connection closed.");
    window.location.reload();
  }

  socket.onerror = function() {
    alert("An error occurred.");
    window.location.reload();
  }
}

function sendMessage() {
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
