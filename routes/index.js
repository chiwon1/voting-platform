const express = require("express");
const router = express.Router();

const Voting = require("../models/Voting");

router.get("/", async function (req, res, next) {
  const aggregatedVoting = await Voting.aggregate([{
    $addFields: {
      isInProgress: { $gt: ["$expiredAt", new Date()] },
    }
  }]);

  const populatedVoting = await Voting.populate(aggregatedVoting, "creator");

  res.render("index", { votings: populatedVoting });
});

module.exports = router;
