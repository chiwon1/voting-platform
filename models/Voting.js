const mongoose = require("mongoose");

const votingSchema = new mongoose.Schema({
  title: {
    type: String,
    maxLength: 50,
    required: true,
  },
  creator: {
    type: String,
    required: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  isProgress: {
    type: Boolean,
    required: true,
  },
  // options: {
  //   type: Array,
  //   of: {
  //     title: {
  //       type: String,
  //       required: true,
  //     },
  //     users: [{
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'User',
  //     }],
  //   },
  //   minLength: 2,
  // },
});

module.exports = mongoose.model("Voting", votingSchema);
