const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Task = sequelize.define("task", {
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
     infractiune: {
          type: Sequelize.INTEGER,
          allowNull: true
     },
     type_id: {
          type: Sequelize.INTEGER,
          allowNull: true
     }
})

module.exports = Task;