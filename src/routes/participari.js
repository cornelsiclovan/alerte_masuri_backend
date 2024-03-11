const express = require("express");
const isAuth = require("../middleware/is-auth");
const partController = require("../controllers/participari_sedinte");

const router = express.Router();

router.get("/", isAuth, partController.getParticipariPenal);

router.post("/", isAuth, partController.addParicipare);

router.post("/clean", isAuth, partController.cleanDateDosare);


module.exports = router;
