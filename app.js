require("dotenv").config();

const express = require("express");
const path = require("path");

const initSession = require("./config/session");
const passport = require("passport");
const initPassport = require("./config/passport");
const connectMongoDB = require("./config/db");

const index = require("./routes/index");
const signup = require("./routes/signup");
const login = require("./routes/login");
const logout = require("./routes/logout");
const votings = require("./routes/votings");
const myVotings = require("./routes/myVotings");

const authenticate = require("./routes/middlewares/authenticate");
const handleInvalidUrl = require("./routes/middlewares/handleInvalidUrl");
const handleError = require("./routes/middlewares/handleError");

const app = express();

connectMongoDB();
initPassport(passport);

app.use(initSession());
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/signup", signup);
app.use("/login", login);
app.use("/", authenticate, index);
app.use("/logout", authenticate, logout);
app.use("/votings/", authenticate, votings);
app.use("/my-votings/", authenticate, myVotings);

app.use(handleInvalidUrl);
app.use(handleError);

module.exports = app;
