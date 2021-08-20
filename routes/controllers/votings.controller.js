const mongoose = require("mongoose");
const createError = require("http-errors");

const Voting = require("../../models/Voting");
const Ballot = require("../../models/Ballot");

const {
  ERROR_NOT_FOUND,
  ERROR_INVALID_VOTING_ID,
} = require("../../constants/errorConstants");

exports.getCreatePage = async function (req, res, next) {
  const name = req.user.name;

  res.render("votingCreation/creation", { name });
};

exports.createVoting = function (req, res, next) {
  try {
    const id = req.user._id;

    const voting = new Voting({
      ...req.body,
      creator: mongoose.Types.ObjectId(id),
      options: req.body.options.map(option => ({ title: option })),
    });

    voting.save();

    res.render("votingCreation/success");
  } catch (err) {
    res.render("votingCreation/failure");
  }
};

exports.getDetails = async function (req, res, next) {
  const votingId = req.params._id;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(votingId)) {
    next(createError(400, ERROR_INVALID_VOTING_ID));
  }

  const aggregatedVoting = Voting.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(votingId) }},
    { $addFields: { isInProgress : { $gt: ["$expiredAt", new Date()] }}},
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",
      },
    },
    {
      $project: {
        title: 1,
        expiredAt: 1,
        isInProgress: 1,
        options: 1,
        creator: { $arrayElemAt: ["$creator", 0] },
      },
    },
  ]).then(value => value[0]);

  const hasCurrentUserVoted = Ballot.exists({ user: userId, voting: votingId });

  const [voting, hasVoted] = await mongoose.Promise.all([aggregatedVoting, hasCurrentUserVoted]);

  if (!voting) {
    return next(createError(404, ERROR_NOT_FOUND));
  }

  const isCurrentUserCreator = userId.equals(voting.creator._id.toString());

  if (isCurrentUserCreator || !voting.isInProgress) {
    const ballot = await Ballot.aggregate([
      { $match: { voting: mongoose.Types.ObjectId(votingId)} },
      {
        $group: {
          _id: "$option",
          count: { $sum: 1 },
        },
      },
    ]).then(result => (
      Object.assign(
        {},
        ...result.map(
          value => (
            { [value._id]: value.count }
          )
        )
      )
    ));

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

exports.vote = async function (req, res, next) {
  const ballot = await new Ballot({
    user: req.user._id,
    voting: req.body.votingId,
    option: req.body.option,
  });

  ballot.save();

  res.redirect(302, "/");
};

exports.delete = async function (req, res, next) {
  const votingId = req.params._id;

  await Voting.deleteOne({ _id: votingId });

  res.status(200);
};
