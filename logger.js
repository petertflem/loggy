var fs = require('fs');
var availableLoggingModules = { };

// Default options
var options = {
  targetLoggingModules: [{ name: 'console' }]
};

/*
  Example settings:
  {
    name: 'websockets',
    settings: {
      host: 'ws://localhost:5000',
      keepAlive: true
    }
  }
*/

function getNewLogEntry (message, logLevel) {
  var now = new Date();
  var date = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate();
  var time =  now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds();

  return {
    "timestamp": date + ' ' + time,
    "level": logLevel,
    "message": message,
    "origin": process.env.npm_package_name || ''
  }
}

initializeLoggingModules();

module.exports.debug = function (message) {
  pipeToActiveLoggingModules(getNewLogEntry(message, 'DEBUG'));
}

module.exports.info = function (message) {
  pipeToActiveLoggingModules(getNewLogEntry(message, 'INFO'));
}

module.exports.warn = function (message) {
  pipeToActiveLoggingModules(getNewLogEntry(message, 'WARN'));
}

module.exports.error = function (message) {
  pipeToActiveLoggingModules(getNewLogEntry(message, 'ERROR'));
}

module.exports.fatal = function (message) {
  pipeToActiveLoggingModules(getNewLogEntry(message, 'FATAL'));
}

function pipeToActiveLoggingModules(data) {
  options.targetLoggingModules
    .forEach(function (loggingModuleName) {
      availableLoggingModules[loggingModuleName].pipe(data);
    });
}

function toModuleName(filename) {
  return filename.replace('.js', '');
}

function initializeLoggingModules () {
  var targetLoggingModules = options.targetLoggingModules;
  targetLoggingModules.forEach(function (moduleInfo) {
    var loggingModule = require(__dirname + '/modules/' + moduleInfo.name);
    if (typeof loggingModule.initialize === 'function')
      loggingModule.initialize(moduleInfo.settings);
  });
}
