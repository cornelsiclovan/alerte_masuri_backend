const express = require("express");
const isAuth = require("../middleware/is-auth");

const completareClasareInsusitaController = require("../controllers/completare_clasare_insusita");
const completareRUP = require("../controllers/completare_rup");
const completareRECH = require("../controllers/completare_rech");
const completareAdresa = require("../controllers/completare_adrese");

const router = express.Router();

router.post(
  "/clasare-insusita",
  isAuth,
  completareClasareInsusitaController.genereaza
);
router.post("/rup", isAuth, completareRUP.genereaza);

router.post("/rech", isAuth, completareRECH.genereaza);

router.post("/adresa", isAuth, completareAdresa.genereaza);

module.exports = router;
