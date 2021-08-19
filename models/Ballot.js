const mongoose = require("mongoose");

const ballotSchema = new mongoose.Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  voting : {
    type: mongoose.Schema.Types.ObjectId,
    unique: 1,
    ref: "Voting"
  },
  option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
  },
});

module.exports.ballotSchema = ballotSchema;
module.exports = mongoose.model("Ballot", ballotSchema);
