const session = require("express-session");
const MongoStore = require("connect-mongo");

function initSession() {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.DB_HOST,
      ttl: 7 * 24 * 60 * 60, // one week
      dbname: "session",
    })
  });
}

module.exports = initSession;
