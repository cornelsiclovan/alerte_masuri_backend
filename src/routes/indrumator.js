const isAuth = require("../middleware/is-auth");
const indrumatorController = require("../controllers/indrumator");
const express = require("express");

const router = express.Router();


router.get("/", isAuth, indrumatorController.getIndrumators);
router.get("/:id_dosar", isAuth, indrumatorController.getIndrumatorByDosarId);
router.post("/", isAuth, indrumatorController.createIndrumator);
router.put("/:taskId", isAuth, indrumatorController.editIndrumator);
router.post("/:indrumatorId/task", indrumatorController.setTaskToIndrumator);
router.get("/:indrumatorId/task", indrumatorController.getIndrumatorTasksByIdIndrumator);
router.delete("/:taskId", indrumatorController.deleteIndrumatorTask)

module.exports = router;