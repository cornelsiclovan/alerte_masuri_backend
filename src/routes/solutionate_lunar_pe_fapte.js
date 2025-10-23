const express = require("express");
const isAuth = require("../middleware/is-auth");

const dosareSolutionateFapteController = require("../controllers/solutionate_lunar_pe_fapte");

const router = express.Router();

router.get("/", isAuth, dosareSolutionateFapteController.getDateDosare);


router.post(
  "/",
  isAuth,
  dosareSolutionateFapteController.addDateDosare
);

router.post("/cleanDateDosare", isAuth, dosareSolutionateFapteController.cleanDateDosare);


module.exports = router;
  