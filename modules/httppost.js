var http = require("http");

module.exports.pipe = function(message) {
  send(message);
};

function send(message) {
  var data = JSON.stringify({
    data: message,
    publishTargets: "logs"
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

  var req = http.request(options);
  req.write(data);
  req.end();
}
