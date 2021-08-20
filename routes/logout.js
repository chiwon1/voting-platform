const express = require("express");
const router = express.Router();

router.post("/", function (req, res, next) {
  req.logout();

  res.redirect("/login");
});

module.exports = router;
