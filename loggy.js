var fs = require('fs');
var path = require('path');
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
    "date": date,
    "time": time,
    "timestamp": date + ' ' + time,
    "level": logLevel,
    "message": message,
    "origin": {
      'npm_module': process.env.npm_package_name || '',
      'filename': path.basename(getCallerFile())
    }
  }
}

module.exports.initialize = function (newOptions) {
  copyToObject(newOptions, options);
  initializeLoggingModules();
}

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
    .forEach(function (loggingModule) {
      availableLoggingModules[loggingModule.name].pipe(data);
    });
}

function toModuleName(filename) {
  return filename.replace('.js', '');
}

function initializeLoggingModules () {
  options.targetLoggingModules.forEach(function (moduleInfo) {
    var loggingModule = require(__dirname + '/modules/' + moduleInfo.name);
    if (typeof loggingModule.initialize === 'function')
      loggingModule.initialize(moduleInfo.settings);
    availableLoggingModules[moduleInfo.name] = loggingModule;
  });
}

function copyToObject(fromObj, toObj) {
  for (var attrname in fromObj)
    toObj[attrname] = fromObj[attrname];
}

function getCallerFile() {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        currentfile = err.stack.shift().getFileName();

        while (err.stack.length) {
            callerfile = err.stack.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc;

    return callerfile;
}
