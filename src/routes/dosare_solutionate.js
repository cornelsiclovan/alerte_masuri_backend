const express = require("express");
const isAuth = require("../middleware/is-auth");

const dosareSolutionateController = require("../controllers/dosare_solutionate");

const router = express.Router();

router.get("/", isAuth, dosareSolutionateController.getDateDosare);


router.post(
  "/",
  isAuth,
  dosareSolutionateController.addDateDosare
);

router.post("/cleanDateDosare", isAuth, dosareSolutionateController.cleanDateDosare);


module.exports = router;
  