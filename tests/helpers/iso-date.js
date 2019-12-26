module.exports.isISODate = (string) => {
  return !!string.match(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?)?(Z|GMT|(\+|-)\d{2}:\d{2})?/)
}