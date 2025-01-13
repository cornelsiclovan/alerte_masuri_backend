const express = require("express");
const isAuth = require("../middleware/is-auth");
const alineatController = require("../controllers/alineat");

const router = express.Router();

router.get("/:id_infractiune", isAuth, alineatController.getAlineateByInfractiuneId);

module.exports = router;