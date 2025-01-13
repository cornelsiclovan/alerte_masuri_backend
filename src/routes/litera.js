const express = require("express");
const isAuth = require("../middleware/is-auth");
const literaController = require("../controllers/litera");

const router = express.Router();

router.get("/:id_alineat", isAuth, literaController.getLitereByIdAlineat);

module.exports = router;