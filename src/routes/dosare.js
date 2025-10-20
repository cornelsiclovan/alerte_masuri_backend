const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const dosarController = require("../controllers/dosar");

const router = express.Router();

router.get("/", isAuth, dosarController.getDosare);
router.get("/dosareCuAc", isAuth, dosarController.getDosareCuAc);
router.get("/dosareCuAn", isAuth, dosarController.getDosareCuAn);

router.get("/dosareCuAcPeProcuror", isAuth, dosarController.getNrDosareCuAcPeProcuror);

router.get("/:dosarId", isAuth, dosarController.getDosarById);

router.post(
  "/",
  isAuth,
  [body("numar").trim().isLength({ min: 3 })],
  dosarController.addDosar
);

router.post("/cleanMasuri", isAuth, dosarController.cleanDataBaseMasuri);
router.post("/cleanDosare", isAuth, dosarController.cleanDataBaseDosar);
router.post("/cleanSechestru", isAuth, dosarController.cleanDataBaseSechestru);
router.post("/cleanDosareCuAc", isAuth, dosarController.cleanDataBaseCuAc);
router.post("/cleanContestatii", isAuth, dosarController.cleanDataBaseContestatii);
router.post("/cleanDosareCuAn", isAuth, dosarController.cleanDataBaseCuAn)

router.patch("/:dosarId", isAuth, dosarController.editDosar);

router.delete("/:dosarId", isAuth, dosarController.deleteDosar);

module.exports = router;
