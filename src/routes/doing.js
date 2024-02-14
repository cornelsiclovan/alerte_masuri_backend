const express = require("express");
const isAuth = require("../middleware/is-auth");
const doingController = require("../controllers/doing");

const router = express.Router();

router.get("/", isAuth, doingController.getDoingByDosarNumber);

router.post("/", isAuth, doingController.postDoing);

router.post("/ac", isAuth, doingController.postDoingAc);

router.post("/cleanDoings", isAuth, doingController.cleanDoings);

router.post("/cleanDoingsAc", isAuth, doingController.cleanDoingsAc);

module.exports = router;
