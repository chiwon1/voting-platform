const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  email: {
    type: String,
    unique: 1,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
    next();
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  const isMatched = await bcrypt.compare(plainPassword, this.password);

  return isMatched;
};

module.exports = mongoose.model("User", userSchema);
