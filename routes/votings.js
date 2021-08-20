const express = require("express");
const router = express.Router();
const controller = require("./controllers/votings.controller");

router.get("/new", controller.getNewVoting);
router.post("/new", controller.createVoting);
router.get("/:_id", controller.getDetails);
router.post("/:_id", controller.vote);
router.post("/:_id/delete", controller.delete);

module.exports = router;
