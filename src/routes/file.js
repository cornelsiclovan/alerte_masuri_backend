const express = require("express");
const isAuth = require("../middleware/is-auth");
const fileController = require("../controllers/file");

const router = express.Router();

router.get("/:dosar_numar", isAuth, fileController.getFileByDosarName);

module.exports = router;