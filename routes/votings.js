const express = require("express");
const router = express.Router();
const votingsController = require("./controllers/votings.controller");

router.get("/:_id", votingsController.get);
// router.post("/new", votingsController.create);

module.exports = router;
