const express = require("express");
const isAuth = require("../middleware/is-auth");
const infractiuniController = require("../controllers/infractiuni");
const router = express.Router();

router.get("/", infractiuniController.getInfractiuni);

module.exports = router;
