const express = require("express");
const isAuth = require("../middleware/is-auth");

const dosareSolutionateController = require("../controllers/dosare_solutionate");

const router = express.Router();

router.get("/", isAuth, dosareSolutionateController.getDateDosare);

router.post("/", isAuth, dosareSolutionateController.addDateDosare);

router.post(
  "/cleanDateDosare",
  isAuth,
  dosareSolutionateController.cleanDateDosare
);

router.get("/stoc", isAuth, dosareSolutionateController.getStoc);

router.post("/stoc", isAuth, dosareSolutionateController.addStoc);

router.post("/upp", isAuth, dosareSolutionateController.addUpp);

router.post(
  "/cleanDateDosare/stoc",
  isAuth,
  dosareSolutionateController.cleanStoc
);

router.post(
  "/cleanDateDosare/upp",
  isAuth,
  dosareSolutionateController.cleanUpp
);

router.get("/incarcatura", isAuth, dosareSolutionateController.getIncarcatura);

router.post("/incarcatura", isAuth, dosareSolutionateController.addIncarcatura);

router.post(
  "/cleanDateDosare/incarcatura",
  isAuth,
  dosareSolutionateController.cleanIncarcatura
);

module.exports = router;
