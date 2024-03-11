const express = require("express");
const isAuth = require("../middleware/is-auth");
const isAdmin = require("../middleware/is-admin");
const ordinController = require("../controllers/ordin");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", isAuth, ordinController.getOrdine);

router.post(
  "/",
  isAuth,
  isAdmin,
  fileUpload.fields([
    { name: "image", maxCount: 12 },
    { name: "docs", maxCount: 12 },
  ]),
  ordinController.postOrdin
);

router.delete(
    "/:ordinId",
    isAuth,
    isAdmin,
    ordinController.deleteOrdin
)

router.patch(
    "/:ordinId",
    isAuth,
    isAdmin,
    fileUpload.fields([
      { name: "image", maxCount: 12 },
      { name: "docs", maxCount: 12 },
    ]),
    ordinController.editOrdin
)


module.exports = router;
