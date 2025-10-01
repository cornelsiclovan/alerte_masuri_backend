const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const TaskType = sequelize.define("task_type", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
   nume: {
        type: Sequelize.STRING,
        allowNull: false
   },
})

module.exports = TaskType;  