const isAuth = require("../middleware/is-auth");
const taskController = require("../controllers/task");
const express = require("express");

const router = express.Router();
router.get("/", isAuth, taskController.getTasks);
router.post("/", isAuth, taskController.createTask);
router.put("/", isAuth, taskController.editTask);
router.delete("/", isAuth, taskController.deleteTask);

module.exports = router;