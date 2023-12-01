function showChat() {
  var roomInfoDiv = document.getElementById('room-info');
  var chatContainerDiv = document.getElementById('chat-container');

  var roomCode = document.getElementById('room-code').value;
  var username = document.getElementById('username').value;

  // write roomCode and username to localstorage
  localStorage.setItem('roomCode', roomCode);
  localStorage.setItem('username', username);

  roomInfoDiv.style.display = 'none';
  chatContainerDiv.style.display = 'block';

  document.getElementById('message-input').focus();
  document.getElementById('room-code-display').innerHTML = roomCode;
  setTimeout(() => { document.getElementById('message-input').value = '' }, 10);
  var roomcode = document.getElementById('room-code').value;
  var username = document.getElementById('username').value;
  initSocket(username, roomcode);
}

function menuOnEnter(event) {
  if (event.keyCode == 13) document.getElementById("join-button").click();
}
function msgOnEnter(event) {
  if (event.keyCode == 13 && !event.shiftKey) document.getElementById("send-button").click();
}

window.onload = function() {
  document.getElementById("room-code").addEventListener("keydown", menuOnEnter);
  document.getElementById("username").addEventListener("keydown", menuOnEnter);
  document.getElementById("message-input").addEventListener("keydown", msgOnEnter);

  // yes I stole this from stack overflow
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    localStorage.setItem('darkMode', 'true');
  }

  // random username guestXXXXX
  document.getElementById("username").value = "guest" + Math.floor(Math.random() * 100000);

  // presets
  // get roomcode and username from localstorage if exists
  if (localStorage.getItem('roomCode')) document.getElementById("room-code").value = localStorage.getItem('roomCode');
  if (localStorage.getItem('username')) document.getElementById("username").value = localStorage.getItem('username');
  
  // GET parameter stuff
  params = new URL(document.location).searchParams;
  if (params.get("roomcode")) {
    document.getElementById("room-code").value = params.get("roomcode");
  }
}

var isDarkMode = localStorage.getItem('darkMode') == 'true';

if (isDarkMode) {
  document.body.classList.add('dark-mode');
}

var darkModeToggle = document.getElementById('dark-mode-toggle');
var body = document.body;

darkModeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
});

function alert(msg) {
  var alert = document.getElementsByClassName('alert')[0];
  alert.style.backgroundColor = '#00c3e6';
  alert.getElementsByTagName('h3')[0].innerHTML = msg;
  showAlertElem();
}
function error(msg) {
  var alert = document.getElementsByClassName('alert')[0];
  alert.style.backgroundColor = '#c50000';
  alert.getElementsByTagName('h3')[0].innerHTML = msg;
  showAlertElem();
}
// show alert div
function showAlertElem() {
  var alert = document.getElementsByClassName('alert')[0];
  alert.style.transform = 'translateY(0)';
  setTimeout(() => { alert.style.transform = 'translateY(-150%)'; }, 5000);
}