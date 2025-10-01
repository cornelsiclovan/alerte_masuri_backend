const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const IndrumatorTask = sequelize.define("indrumator_task", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    id_indrumator: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    id_task: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    task_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    task_type: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: {   
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nota: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = IndrumatorTask;