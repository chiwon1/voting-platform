const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const validator = require("email-validator");
const createError = require("http-errors");

const User = require("../models/User");
const {
  ERROR_INVALID_SIGNUP_INPUT,
  ERROR_DUPLICATE_EMAIL,
  ERROR_CONFIRMATION_PASSWORD_NOT_MATCHING,
} = require("../constants/errorConstants");

router.get("/", function (req, res, next) {
  res.render("signup");
});

router.post("/", function (req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      throw createError(400, ERROR_INVALID_SIGNUP_INPUT);
    }

    if (!name.trim()) {
      throw createError(400, ERROR_INVALID_SIGNUP_INPUT);
    }

    if (!validator.validate(email)) {
      throw createError(400, ERROR_INVALID_SIGNUP_INPUT);
    }

    if (password !== confirmPassword) {
      throw createError(400, ERROR_CONFIRMATION_PASSWORD_NOT_MATCHING);
    }

    const user = new User(req.body);

    user.save();

    res.redirect(302, "/login");
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return next(createError(400, ERROR_DUPLICATE_EMAIL));
    }

    if (err instanceof mongoose.Error.ValidationError) {
      return next(createError(400, ERROR_INVALID_SIGNUP_INPUT));
    }

    next(err);
  }
});

module.exports = router;
