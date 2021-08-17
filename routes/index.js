const express = require("express");
const router = express.Router();
const Voting = require("../models/Voting");

router.get("/", async function (req, res, next) {
  const votings = await Voting.find();

  res.render("index", { votings });
});

module.exports = router;
