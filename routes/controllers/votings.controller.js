const mongoose = require("mongoose");
const createError = require("http-errors");

const User = require("../../models/User");
const Voting = require("../../models/Voting");
const Ballot = require("../../models/Ballot");

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

exports.getDetails = async function (req, res, next) {
  const id = req.params._id;

  if (!mongoose.isValidObjectId(id)) {
    next(createError(400, ERROR_INVALID_VOTING_ID));
  }

  const voting = await Voting.aggregate([{
    $match: { _id : mongoose.Types.ObjectId(id) }},
    { $addFields: { isInProgress : { $gt: ["$expiredAt", new Date()] }}},
    {
      $lookup: {
      from: "users",
      localField : "creator",
      foreignField : "_id",
      as: "creator",
    }},
    {
      $project: {
        title: 1,
        expiredAt: 1,
        isInProgress: 1,
        options: 1,
        creator: { $arrayElemAt:["$creator", 0] },
      }
    }
  ]).then(value => value[0]);

  if (!voting) {
    return next(createError(404, ERROR_NOT_FOUND));
  }

  const hasVoted = await Ballot.exists({ votingId: id });
  const isCurrentUserCreator = req.user._id.equals(voting.creator._id.toString());

  if (isCurrentUserCreator || !voting.isInProgress) {
    const ballot = await Ballot.aggregate([{
        $match: { voting : mongoose.Types.ObjectId(id)}
      },
      {
        $group: {
          _id: "$option",
          count: { $sum: 1 },
        }
      },
      ]).then(arr => (
      Object.assign({}, ...arr.map(value => ({ [value._id.toString()]: value.count })))));

    const votingWithOption = {
      ...voting,
      options: voting.options.map(option => {
        const ballotId = option._id.toString();

        return {
          ...option,
          count: ballot[ballotId] || 0,
        };
      }),
    };

    return res.render("votingDetails", { voting: votingWithOption, isCurrentUserCreator, hasVoted });
  }

  res.render("votingDetails", { voting, isCurrentUserCreator, hasVoted });
};

// exports.create = async function (req, res, next) {
// };

// exports.update = async function (req, res, next) {
// };
