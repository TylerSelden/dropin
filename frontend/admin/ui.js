function showPanel() {
  var roomInfoDiv = document.getElementById('room-info');
  var panelContainerDiv = document.getElementById('panel-container');

  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  // write username and password to localstorage
  localStorage.setItem('adminUsername', username);
  localStorage.setItem('adminPassword', password);

  roomInfoDiv.style.display = 'none';
  panelContainerDiv.style.display = 'block';

  document.getElementById('room-code-display').innerHTML = "Admin Panel";
  initSocket();
}

function menuOnEnter(event) {
  if (event.keyCode == 13) document.getElementById("join-button").click();
}
function msgOnEnter(event) {
  if (event.keyCode == 13 && !event.shiftKey) document.getElementById("send-button").click();
}

window.onload = function() {
  document.getElementById("username").addEventListener("keydown", menuOnEnter);
  document.getElementById("password").addEventListener("keydown", menuOnEnter);

  // yes I stole this from stack overflow
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    localStorage.setItem('darkMode', 'true');
  }

  // presets

  // GET parameter stuff
  params = new URL(document.location).searchParams;
  if (params.get("username")) {
    document.getElementById("username").value = params.get("username");
  }
  // get username and password from localstorage if exists
  if (localStorage.getItem('adminUsername')) document.getElementById("username").value = localStorage.getItem('adminUsername');
  if (localStorage.getItem('adminPassword')) document.getElementById("password").value = localStorage.getItem('adminPassword');
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
