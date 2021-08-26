const ERROR = require("../../constants/errorConstants");

function handleError(err, req, res, next) {
  if (!err.status) {
    res.locals.message = ERROR.INTERNAL_SERVER_ERROR;
  } else {
    res.locals.message = err.message;
  }

  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  if (req.headers["content-type"] === "application/json") {
    res.json({
      error: req.app.get("env") === "development" ? res.locals.message : ERROR.INTERNAL_SERVER_ERROR
    });
  } else {
    res.render("error");
  }
}

module.exports = handleError;
