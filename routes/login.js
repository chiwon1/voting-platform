const express = require("express");
const router = express.Router();

const passport = require("passport");

router.get("/", function (req, res, next) {
  res.render("login");
});

router.post("/", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.redirect("/login");
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      if (req.session.originalUrl) {
        return res.redirect(req.session.originalUrl);
      }

      res.redirect("/");
    });
  })(req, res, next);
});

module.exports = router;
