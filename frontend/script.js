var socket = new WebSocket("ws://localhost:8080");

socket.onmessage = function(event) {
  var msg = event.data;
  console.log(msg);
}

