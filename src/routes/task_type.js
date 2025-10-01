const isAuth = require("../middleware/is-auth");
const typeController = require("../controllers/task_type");
const express = require("express");

const router = express.Router();
router.get("/", isAuth, typeController.getTaskTypes);


module.exports = router;