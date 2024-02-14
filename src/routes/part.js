const express = require("express");
const isAuth = require("../middleware/is-auth");
const partController = require("../controllers/part");

const router = express.Router();

router.get("/", isAuth, partController.getPArtByDosarNumber);

router.post("/", isAuth, partController.postPart);

router.post("/ac", isAuth, partController.postPartAc);

router.post("/cleanParts", isAuth, partController.cleanParts);

router.post("/cleanPartsAc", isAuth, partController.cleanPartsAc);

module.exports = router;
