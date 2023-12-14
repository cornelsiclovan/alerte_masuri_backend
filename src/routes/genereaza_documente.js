const express = require("express");
const isAuth = require("../middleware/is-auth");

const completareClasareInsusitaController = require("../controllers/completare_clasare_insusita");
const completareRUP = require("../controllers/completare_rup");

const router = express.Router();

router.post(
  "/clasare-insusita",
  isAuth,
  completareClasareInsusitaController.genereaza
);
router.post("/rup", isAuth, completareRUP.genereaza);

module.exports = router;
