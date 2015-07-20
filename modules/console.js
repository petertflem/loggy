module.exports.pipe = function (data) {
  console.log('[' + data.timestamp + '][' + data.level + '][' + data.origin + '] ' + data.message);
}
