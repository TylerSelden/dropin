const fs = require('fs');

var origData = JSON.parse(fs.readFileSync('./backup.json'));

console.log(origData);

var lastRoomTimes = {};
for (var i in origData) {
  lastRoomTimes[i] = Date.now();
}

console.log(lastRoomTimes);

fs.writeFileSync('./newbackup.json', JSON.stringify([origData, lastRoomTimes]))