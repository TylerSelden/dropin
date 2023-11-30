var socket, username, password;

// todo:
// edit onmessage
// handle adminInit

function initSocket() {
  socket = new WebSocket("wss://server.benti.dev:8443");
  // socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = function(event) {
    var msg = JSON.parse(event.data);
    if (msg.type == "error") {
      socket.close();
      error(msg.message);
      setTimeout(() => { window.location.reload() }, 5000);
    }

    var panelContent = document.getElementById("panel-content");
    // var atBottom = (Math.ceil(panelContent.scrollTop) >= panelContent.scrollHeight - panelContent.offsetHeight - 1);
    // safe to assume message at this point
    panelContent.innerHTML += msg.message;

    // if user is already scrolled to bottom, scroll to bottom
    if (atBottom) panelContent.scrollTop = panelContent.scrollHeight;
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
