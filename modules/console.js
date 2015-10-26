module.exports.pipe = function (data) {
  console.log('[' + data.date + ' ' + data.time + '][' + data.logLevel.toUpperCase() + ']\
[' + data.origin.npmModule + '][' + data.origin.filename + ']\
[' + data.origin.fn + '()][' + data.origin.lineNumber + '] ' + data.message);
}
