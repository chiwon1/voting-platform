const createError = require("http-errors");
const ERROR = require("./../../constants/errorConstants");

function handleInvalidUrl(req, res, next) {
  next(createError(404, ERROR.NOT_FOUND));
}

module.exports = handleInvalidUrl;
