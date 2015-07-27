var fs = require('fs');
var path = require('path');
var availableLoggingModules = { };

// Default options
var options = {
  targetLoggingModules: [{ name: 'console' }]
};

/* I want to read a config file from root */

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

function getStackStrace() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
      return stack;
  };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getLineNumber() {
  return getStackStrace()[3].getLineNumber();
}

function getCallerFunction() {
  return getStackStrace()[3].getFunctionName();
}

function getCallerFile() {
  return getStackStrace()[3].getFileName();
}

function getNewLogEntry (message, logLevel) {
  var now = new Date();
  var date = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate();
  var time =  now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + ':' + now.getMilliseconds();

  return {
    date: date,
    time: time,
    logLevel: logLevel.toLowerCase(),
    message: message,
    origin: {
      npmModule: process.env.npm_package_name || '',
      filename: path.basename(getCallerFile()),
      fn: getCallerFunction(),
      lineNumnber: getLineNumber()
    }
  }
}
