const express = require("express");
const isAuth = require("../middleware/is-auth");
const pedepseController = require("../controllers/pedepse");
const router = express.Router();

router.get("/", pedepseController.getPedepse);

module.exports = router;
