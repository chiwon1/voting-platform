const mongoose = require("mongoose");

const ballotSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  voting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voting"
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
  },
});

module.exports = mongoose.model("Ballot", ballotSchema);
