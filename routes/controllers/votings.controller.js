const mongoose = require("mongoose");
const createError = require("http-errors");

const Voting = require("../../models/Voting");

const {
  ERROR_NOT_FOUND,
  ERROR_INVALID_VOTING_ID,
} = require("../../constants/errorConstants");

exports.get = async function (req, res, next) {
  const id = req.params._id;

  if (!mongoose.isValidObjectId(id)) {
    next(createError(400, ERROR_INVALID_VOTING_ID));
  }

  const voting = await Voting.findById(id);

  if (!voting) {
    return next(createError(404, ERROR_NOT_FOUND));
  }

  res.render("voting", { voting });
};

// exports.create = async function (req, res, next) {
// };

// exports.update = async function (req, res, next) {
// };
