var http = require("http");
var enforceHttpRequestOrder = true;
var canSendRequest = true;
var messageQueue = [];

module.exports.pipe = function(message) {
  enforceHttpRequestOrder ? messageQueue.push(message) : send(message);

  if (canSendRequest && enforceHttpRequestOrder) {
    send(messageQueue.shift());
  }
};

function send(message) {
  if (enforceHttpRequestOrder)
    canSendRequest = false;

  var data = JSON.stringify({
    data: message,
    publishTargets: 'logs'
  });

  var options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/logs',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  var req = http.request(options, httpRequestCallback);

  req.write(data);
  req.end();
}

function httpRequestCallback (response) {
  if (enforceHttpRequestOrder) {
    canSendRequest = true;
    messageQueue.length > 0 && send(messageQueue.shift());
  }
}
