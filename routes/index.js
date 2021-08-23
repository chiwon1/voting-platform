const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Voting = require("../models/Voting");

const { ERROR_INVALID_DATA } = require("../constants/errorConstants");

router.get("/", async function (req, res, next) {
  const username = req.user ? req.user.name : null;

  try {
    const aggregatedVoting = await Voting.aggregate([{
      $addFields: {
        isInProgress: { $gt: ["$expiredAt", new Date()] },
      }
    }]);

    const populatedVoting = await Voting.populate(aggregatedVoting, "creator");

    res.render("index", { votings: populatedVoting, username });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR_INVALID_DATA));
    }

    next(err);
  }
});

module.exports = router;
