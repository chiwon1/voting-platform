const express = require("express");
const router = express.Router();
const controller = require("./controllers/votings.controller");

router.get("/new", controller.getCreatePage);
router.post("/new", controller.createVoting);
router.get("/:_id", controller.getDetails);

module.exports = router;
