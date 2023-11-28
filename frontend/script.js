var socket;

function initSocket(username, roomcode) {
  socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.type == "error") {
      alert(msg.message);
      window.location.reload();
    }
    // safe to assume message at this point
    document.getElementById("chat-content").innerHTML += msg.message;
  }

  socket.onopen = function() {
    socket.send(JSON.stringify({type: "init", username: username, roomcode: roomcode}));
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