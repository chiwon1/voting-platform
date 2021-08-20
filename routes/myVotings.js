const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Voting = require("../models/Voting");

const { ERROR_INVALID_USER, ERROR_INVALID_DATA } = require("../constants/errorConstants");

router.get("/", async function (req, res, next) {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createError(400, ERROR_INVALID_USER);
    }

    const aggregatedVoting = await Voting.aggregate([
      { $match: { creator: mongoose.Types.ObjectId(userId) }},
      { $addFields: { isInProgress : { $gt: ["$expiredAt", new Date()] }},
    }]);

    const populatedVoting = await Voting.populate(aggregatedVoting, "creator");

    res.render("index", { votings : populatedVoting });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR_INVALID_DATA));
    }

    next(err);
  }
});

module.exports = router;
