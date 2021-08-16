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
  token: String,
  tokenExp: Number,
});

userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
