const createError = require("http-errors");
const { ERROR_NOT_FOUND } = require("./../../constants/errorConstants");

const handleInvalidUrl = function (req, res, next) {
  next(createError(404, ERROR_NOT_FOUND));
}

module.exports = handleInvalidUrl;
