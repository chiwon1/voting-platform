const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const validator = require("email-validator");
const createError = require("http-errors");

const User = require("../models/User");

const ERROR = require("../constants/errorConstants");

router.get("/", function (req, res, next) {
  res.render("signup");
});

router.post("/", async function (req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      throw createError(400, ERROR.INVALID_SIGNUP_INPUT);
    }

    if (!name.trim()) {
      throw createError(400, ERROR.INVALID_SIGNUP_INPUT);
    }

    if (!validator.validate(email)) {
      throw createError(400, ERROR.INVALID_SIGNUP_INPUT);
    }

    if (password !== confirmPassword) {
      throw createError(400, ERROR.CONFIRMATION_PASSWORD_NOT_MATCHING);
    }

    const user = new User(req.body);

    await user.save();

    res.redirect(302, "/login");
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return next(createError(400, ERROR.DUPLICATE_EMAIL));
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR.INVALID_SIGNUP_INPUT));
    }

    next(err);
  }
});

module.exports = router;
