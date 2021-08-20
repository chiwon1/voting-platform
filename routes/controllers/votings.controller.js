const mongoose = require("mongoose");
const createError = require("http-errors");

const Voting = require("../../models/Voting");
const Ballot = require("../../models/Ballot");

const {
  ERROR_NOT_FOUND,
  ERROR_INVALID_VOTING_ACCESS,
  ERROR_INVALID_TITLE,
  ERROR_INVALID_VOTING_CREATOR,
  ERROR_INVALID_VOTING_OPTION,
  ERROR_NOT_ENOUGH_OPTIONS_INPUT,
  ERROR_INVALID_EXPIRATION,
  ERROR_INVALID_USER,
  ERROR_INVALID_VOTING,
  ERROR_INVALID_DATA,
  ERROR_INVALID_ACCESS,
} = require("../../constants/errorConstants");

exports.getCreatePage = async function (req, res, next) {
  const name = req.user.name;

  res.render("votingCreation/creation", { name });
};

exports.createVoting = function (req, res, next) {
  try {
    const { title, creator, expiredAt, options } = req.body;

    if (!title) {
      throw createError(400, ERROR_INVALID_TITLE);
    }

    if (!creator) {
      throw createError(400, ERROR_INVALID_VOTING_CREATOR);
    }

    if (!expiredAt) {
      throw createError(400, ERROR_INVALID_EXPIRATION);
    }

    if (!options) {
      throw createError(400, ERROR_INVALID_VOTING_OPTION);
    }

    if (options.length < 2) {
      throw createError(400, ERROR_NOT_ENOUGH_OPTIONS_INPUT);
    }

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
  const userId = req.user ? req.user._id : null;

  if (!mongoose.isValidObjectId(votingId)) {
    next(createError(400, ERROR_INVALID_VOTING_ACCESS));
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

  const isCurrentUserCreator = userId?.equals(voting.creator._id.toString());

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
  try {
    if (!req.user) {
      req.session.originalUrl = req.originalUrl;

      return res.redirect(302, "/login");
    }

    const userId = req.user._id;
    const { votingId, option: optionId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw createError(400, ERROR_INVALID_USER);
    }

    if (!mongoose.Types.ObjectId.isValid(votingId)) {
      throw createError(400, ERROR_INVALID_VOTING);
    }

    if (!mongoose.Types.ObjectId.isValid(optionId)) {
      throw createError(400, ERROR_INVALID_VOTING_OPTION);
    }

    const ballot = await new Ballot({
      user: userId,
      voting: votingId,
      option: optionId,
    });

    ballot.save();

    res.redirect(302, "/");
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR_INVALID_DATA));
    }

    next(err);
  }
};

exports.delete = async function (req, res, next) {
  const votingId = req.params._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(votingId)) {
      throw createError(400, ERROR_INVALID_ACCESS);
    }

    await Voting.deleteOne({ _id: votingId });

    res.status(200);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR_INVALID_DATA));
    }

    next(err);
  }
};
