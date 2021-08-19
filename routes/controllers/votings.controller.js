const mongoose = require("mongoose");
const createError = require("http-errors");

const Voting = require("../../models/Voting");

const {
  ERROR_NOT_FOUND,
  ERROR_INVALID_VOTING_ID,
} = require("../../constants/errorConstants");

exports.getCreatePage = async function (req, res, next) {
  const name = req.user.name;

  res.render("votingCreation", { name });
};

exports.createVoting = function (req, res, next) {
  const id = req.user._id;

  const obj = {
    ...req.body,
    creator: mongoose.Types.ObjectId(id),
    options: req.body.options.map(option => ({ title: option })),
  };

  const voting = new Voting(obj);

  voting.save();

  res.redirect(302, "/");
};

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
