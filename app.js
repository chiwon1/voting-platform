const express = require("express");
const path = require("path");
require("dotenv").config();

const index = require("./routes/index");
const signup = require("./routes/signup");
const login = require("./routes/login");
// const logout = require("./routes/logout");
// const votings = require("./routes/votings");
// const myVotings = require("./routes/myVotings");

const connectMongoDB = require("./config/db");

// const authentication = require("./routes/middlewares/authentication");
const handleInvalidUrl = require("./routes/middlewares/handleInvalidUrl");
const handleError = require("./routes/middlewares/handleError");

const app = express();

connectMongoDB();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/signup", signup);
app.use("/login", login);
app.use("/", index);
// app.use("/logout", authentication, logout);
// app.use("/votings/", authentication, votings);
// app.use("/my-votings/", authentication, myVotings);

app.use(handleInvalidUrl);
app.use(handleError);

module.exports = app;
