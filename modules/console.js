module.exports.pipe = function (data) {
  console.log('[' + data.date + ' ' + data.time + '][' + data.logLevel + ']\
[' + data.origin.npm_module + '][' + data.origin.filename + ']\
[' + data.origin.fn + '()][' + data.origin.lineNumnber + '] ' + data.message);
}
