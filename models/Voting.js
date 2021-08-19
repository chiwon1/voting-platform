const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  whoVoted: {
    type: Array,
  },
});

const votingSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 50,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  options: {
    type: [optionSchema],
    required: true,
    min: 2,
  },
});

module.exports = mongoose.model("Voting", votingSchema);
