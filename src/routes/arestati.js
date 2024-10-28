const express = require("express");
const isAuth = require("../middleware/is-auth");
const arestatiController = require("../controllers/arestati");

const router = express.Router();

router.get("/", isAuth, arestatiController.getArestati);

router.post("/", isAuth, arestatiController.postArestati);

router.post("/cleanArestati", isAuth,  arestatiController.cleanArestati);

module.exports = router;
