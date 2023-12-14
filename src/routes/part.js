const express = require("express");
const isAuth = require("../middleware/is-auth");
const partController = require("../controllers/part");

const router = express.Router();

router.get("/", isAuth, partController.getPArtByDosarNumber);

router.post("/", isAuth, partController.postPart);

router.post("/cleanParts", isAuth, partController.cleanParts);

module.exports = router;
