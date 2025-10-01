const { Sequelize } = require("sequelize");
const Task = require("../models/task");
const TaskType = require("../models/task_type");

const op = Sequelize.Op;

exports.getTaskTypes = async (req, res, next) => {
    let queryObject = {};
    let types;

    try {
        types = await TaskType.findAll();

        res.send(types);
    } catch (error) {
        res.send(error);
    }
}
