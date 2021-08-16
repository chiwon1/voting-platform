const session = require("express-session");

function initSession() {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
  });
}

module.exports = initSession;
