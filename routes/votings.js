const express = require("express");
const router = express.Router();
const controller = require("./controllers/votings.controller");

router.get("/new", controller.getCreatePage);
router.post("/new", controller.createVoting);
router.delete("/:_id", controller.delete);
router.get("/:_id", controller.getDetails);
router.post("/:_id", controller.vote);

module.exports = router;
