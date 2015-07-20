module.exports.pipe = function (data) {
  console.log('[' + data.timestamp + '][' + data.level + '][' + data.origin.npm_module + '][' + data.origin.filename + '] ' + data.message);
}
