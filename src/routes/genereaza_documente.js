const express = require("express");
const isAuth = require("../middleware/is-auth");

const dosareSolutionateController = require("../controllers/dosare_solutionate");
const completareClasareInsusitaController = require("../controllers/completare_clasare_insusita");

const router = express.Router();


router.post(
  "/",
  isAuth,
  dosareSolutionateController.addDateDosare
);

router.post("/clasare-insusita", isAuth, completareClasareInsusitaController.genereaza);

module.exports = router;
