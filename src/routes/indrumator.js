const isAuth = require("../middleware/is-auth");
const indrumatorController = require("../controllers/indrumator");
const express = require("express");

const router = express.Router();


router.get("/", isAuth, indrumatorController.getIndrumators);
router.get("/:id_dosar", isAuth, indrumatorController.getIndrumatorByDosarId);
router.post("/", isAuth, indrumatorController.createIndrumator);
router.put("/:taskId", isAuth, indrumatorController.editIndrumator);
router.post("/:indrumatorId/task", isAuth, indrumatorController.setTaskToIndrumator);
router.get("/:indrumatorId/task", isAuth, indrumatorController.getIndrumatorTasksByIdIndrumator);
router.delete("/:taskId", isAuth, indrumatorController.deleteIndrumatorTask)
router.put("/finalizeaza/:id_indrumator", isAuth, indrumatorController.finalizeazaNota);
router.get("/dosar/:id", isAuth, indrumatorController.getIndrumatorsByDosarId);
router.put("/refacere_nota_finalizata/:id", isAuth, indrumatorController.revinoLaNotaFinalizata);

module.exports = router;