const express = require("express");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator/check");
const dosarController = require("../controllers/dosar");

const router = express.Router();

router.get("/", isAuth, dosarController.getDosare);

router.get("/:dosarId", isAuth, dosarController.getDosarById);

router.post(
  "/",
  isAuth,
  [
    body("numar").trim().isLength({ min: 3 })
  ],
  dosarController.addDosar
);

router.patch("/:dosarId", isAuth, dosarController.editDosar);

router.delete("/:dosarId", isAuth, dosarController.deleteDosar);

module.exports = router;
