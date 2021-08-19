const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Voting = require("../models/Voting");

router.get("/", async function (req, res, next) {
  const userId = req.user._id;

  const aggregatedVoting = await Voting.aggregate([
    { $match: { creator: mongoose.Types.ObjectId(userId) }},
    { $addFields: { isInProgress : { $gt: ["$expiredAt", new Date()] }},
  }]);

  const populatedVoting = await Voting.populate(aggregatedVoting, "creator");

  res.render("index", { votings : populatedVoting });
});

module.exports = router;
