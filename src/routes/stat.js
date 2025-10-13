const isAuth = require("../middleware/is-auth");
const statsController = require("../controllers/stats");
const express = require("express");

const router = express.Router();
router.get("/", isAuth, statsController.getStats);
router.post("/", isAuth, statsController.postStat);

module.exports = router;