var WebSocket = require('ws');
var keepAlive = false;
var ws;
var messageQueue = [];
var connected = false;

module.exports.initialize = function(settings) {
  ws = new WebSocket(settings.host);
  keepAlive = settings.keepAlive;
  var pingId;

  ws.on('open', function () {
    if (keepAlive) pingId = setInterval(function () { ws.ping(); }, 45000);
    connected = true;
    sendQueuedMessages();
  });

  ws.on('close', function () {
    keepAlive && clearInterval(pingId);
    connected = false;
  });
}

module.exports.pipe = function(message) {
  connected ? send(message) : messageQueue.push(message);
}

function sendQueuedMessages() {
  while (messageQueue.length > 0) {
    send(messageQueue.shift());
  }
}

function send(message) {
  ws.send(JSON.stringify(message));
}

//If no server running, try new connection every x seconds?
